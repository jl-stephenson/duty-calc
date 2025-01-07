import firebase_admin
from firebase_admin import credentials, storage
from firebase_functions import https_fn
import os
import tempfile
from pypdf import PdfReader, PdfWriter
import logging
from datetime import datetime
import yaml
from typing import Dict, Any
from dotenv import load_dotenv
import math

load_dotenv('.env.local')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

logging.info(f"Environment: {os.getenv('ENVIRONMENT')}")

firebase_admin.initialize_app()

def load_duty_rates() -> Dict[str, Any]:
    try:

        if os.getenv('ENVIRONMENT') == 'production':
            bucket = storage.bucket()
            blob = bucket.blob('config/duty_rates.yaml')

            _, temp_local_filename = tempfile.mkstemp()

            blob.download_to_filename(temp_local_filename)

            with open(temp_local_filename, 'r') as f:
                config = yaml.safe_load(f)

            os.remove(temp_local_filename)

            return config 

        else:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(current_dir)
            config_path = os.path.join(project_root, 'duty_rates.yaml')

            logging.info(f"Loading duty rates from {config_path}")

            with open(config_path, 'r') as f:
                config = yaml.safe_load(f)
        
            return config
    
    except Exception as e:
        logging.error(f"Error loading duty rates: {str(e)}")
        raise

def calculate_duty(wine_entry: dict, duty_rates: dict, row_index: int) -> dict:
    abv = float(wine_entry['abv'])

    matching_rate = None

    wine_rates = duty_rates['duty_rates']['wine']['standard']

    for rate_type, rate_info in wine_rates.items():
        if rate_info['min_abv'] <= abv <= rate_info['max_abv']:
            matching_rate = rate_info
            break

    if not matching_rate:
        logging.error(f"No matching duty rate found for ABV: {abv}")
        return None
    
    total_sold = (wine_entry['containerSize'] * wine_entry['unitsSold']) / 1000
    total_pure_alcohol = total_sold * (abv / 100)
    duty_rate = matching_rate['rate_per_litre_alcohol']
    total_duty = total_pure_alcohol * duty_rate

    abv_formatted = f"{abv:.1f}"
    duty_rate_formatted = f"{duty_rate:.2f}"
    total_duty_formatted = f"{math.floor(total_duty * 100) / 100:.2f}"

    tax_code = matching_rate['code']
    result = {}

    for i, digit in enumerate(tax_code):
        result[f"Row{row_index}_TC{i}"] = digit

    result[f"Row{row_index}_Quantity"] = str(total_sold)

    abv_reversed = list(abv_formatted.replace(".", ""))
    abv_reversed.reverse()
    for i, digit in enumerate(abv_reversed):
        result[f"Row{row_index}_ABV{i}"] = digit

    duty_rate_reversed = list(duty_rate_formatted.replace(".", ""))
    duty_rate_reversed.reverse()
    for i, digit in enumerate(duty_rate_reversed):
        result[f"Row{row_index}_DR{i}"] = digit  

    total_duty_reversed = list(total_duty_formatted.replace(".", ""))
    total_duty_reversed.reverse()
    for i, digit in enumerate(total_duty_reversed):
        result[f"Row{row_index}_ED{i}"] = digit

    return result 

def generate_unique_filename():
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    return f"EX606_filled_{timestamp}.pdf"

def get_current_date_formatted() -> str:
    return datetime.now().strftime('%d/%m/%Y')

def create_urn_field_mapping(urn):
    if not urn or not isinstance(urn, str) or len(urn) != 12 or not urn.isdigit():
        logging.error(f"Invalid URN format: {urn}")
        raise ValueError("URN must be a 12-digit numeric string")
    
    return {f"URN{i}": digit for i, digit in enumerate(urn)}

def create_date_field_mapping(date_str: str, field_prefix: str) -> dict:
    """
    Convert a date string in DD/MM/YYYY format to individual field mappings.
    """
    logging.info(f"Creating date mapping for {field_prefix} with date: '{date_str}'")
    
    if not date_str or not isinstance(date_str, str):
        logging.error(f"Invalid date format for {field_prefix}: {date_str}")
        raise ValueError(f"Date must be in DD/MM/YYYY format, got: {date_str}")
    
    # Split and validate date parts
    parts = date_str.split('/')
    logging.info(f"Split date parts: {parts}")
    
    if len(parts) != 3:
        logging.error(f"Invalid date format for {field_prefix}, parts: {parts}")
        raise ValueError(f"Date must be in DD/MM/YYYY format, got: {date_str}")
        
    day, month, year = parts
    logging.info(f"Before padding - day: '{day}', month: '{month}', year: '{year}'")
    
    try:
        day = str(day).zfill(2)
        month = str(month).zfill(2)
        year = str(year).zfill(4)
        logging.info(f"After padding - day: '{day}', month: '{month}', year: '{year}'")
    except Exception as e:
        logging.error(f"Error during padding: {str(e)}")
        raise
    
    try:
        mapping = {}
        logging.info(f"Creating mapping for day: {day}")
        mapping[f"{field_prefix}D0"] = day[0]
        mapping[f"{field_prefix}D1"] = day[1]
        
        logging.info(f"Creating mapping for month: {month}")
        mapping[f"{field_prefix}M0"] = month[0]
        mapping[f"{field_prefix}M1"] = month[1]
        
        logging.info(f"Creating mapping for year: {year}")
        mapping[f"{field_prefix}Y0"] = year[0]
        mapping[f"{field_prefix}Y1"] = year[1]
        mapping[f"{field_prefix}Y2"] = year[2]
        mapping[f"{field_prefix}Y3"] = year[3]
        
        logging.info(f"Final mapping: {mapping}")
        return mapping
        
    except IndexError as e:
        logging.error(f"Index error while creating mapping - day: '{day}', month: '{month}', year: '{year}'")
        raise
    except Exception as e:
        logging.error(f"Unexpected error while creating mapping: {str(e)}")
        raise


@https_fn.on_call()
def process_pdf(req):
    try:
        if not context.auth:
            return {
                "status": "error",
                "error": "Authentication required."
            }
        
        uid = context.auth.uid

        logging.info(f"Received request data: {req.data}")
        
        form_data_from_request = req.data if req.data else {}

        required_fields = ['tradingName', 'urn', 'periodFrom', 'periodTo', 'wineEntries']
        missing_fields = [field for field in required_fields if not form_data_from_request.get(field)]
        
        if missing_fields:
            return {
                "status": "error",
                "error": f"Missing required fields: {', '.join(missing_fields)}",
            }
        

        try:
            duty_rates = load_duty_rates()
        except Exception as e:
            logging.error(f"Error loading duty rates: {str(e)}")
            return {
                "status": "error",
                "error": "Failed to load duty rates"
            }

        urn = form_data_from_request.get('urn', '')
        period_from = form_data_from_request.get('periodFrom', '')
        period_to = form_data_from_request.get('periodTo', '')
        wine_entries = form_data_from_request.get('wineEntries', [])

        submission_date = get_current_date_formatted()

        pdf_form_data = {
            'TradingName0': form_data_from_request.get('tradingName', ''),
            'TradingAddress0': form_data_from_request.get('tradingAddress0', ''),
            'Postcode': form_data_from_request.get('postcode', ''),
            # Page 2 fields
            'FullName0': form_data_from_request.get('fullName', ''),
            'Capacity0': form_data_from_request.get('capacity', '')
        }

        urn_mappings = create_urn_field_mapping(urn)
        pdf_form_data.update(urn_mappings)

        try:
            period_from_mappings = create_date_field_mapping(period_from, 'PeriodFrom')
            period_to_mappings = create_date_field_mapping(period_to, 'PeriodTo')
            
            submit_date_mappings = create_date_field_mapping(
                submission_date,
                'SubmitDate_'
            )

            for i, entry in enumerate(wine_entries):
                duty_calculations = calculate_duty(entry, duty_rates, i)
                if duty_calculations:
                    pdf_form_data.update(duty_calculations)

            pdf_form_data.update(period_from_mappings)
            pdf_form_data.update(period_to_mappings)
            pdf_form_data.update(submit_date_mappings)
            
            logging.info("Date mappings created successfully")
            logging.info(f"Period From mappings: {period_from_mappings}")
            logging.info(f"Period To mappings: {period_to_mappings}")
        except ValueError as e:
            logging.error(f"Data validation failed: {str(e)}")
            return {
                "error": str(e),
                "status": "error"
            }
        except Exception as e:
            logging.error(f"Unexpected error in data mapping: {str(e)}")
            return {
                "error": "An error occurred while processing the data",
                "status": "error"
            }

        bucket = storage.bucket()

        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf', mode='wb') as temp_input:
            source_blob = bucket.blob("EX606_form_fields_optimised.pdf")
            source_blob.download_to_file(temp_input)
            temp_input_name = temp_input.name

        temp_output = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        temp_output_name = temp_output.name
        temp_output.close()

        try:
            reader = PdfReader(temp_input_name)
            writer = PdfWriter()

            if len(reader.pages) < 2:
                raise ValueError("The input PDF must have 2 pages")

            logging.info("Printing form field information:")

            writer.append(reader)

            for page_num in range(len(writer.pages)):
                writer.update_page_form_field_values(
                    writer.pages[page_num], 
                    pdf_form_data,
                    auto_regenerate=False
                )

            logging.info("Attempted to fill the following fields:")
            for field, value in pdf_form_data.items():
                logging.info(f"Field: {field}, Value: {value}")

            with open(temp_output_name, 'wb') as output_stream:
                writer.write(output_stream)
            logging.info(f"PDF form filled successfully. Output saved to temporary file")

        except Exception as e:
            logging.error(f"Error processing PDF: {str(e)}")
            raise e
        
        unique_filename = generate_unique_filename()

        modified_blob_path = f"modified_forms/{unique_filename}"
        modified_blob = bucket.blob(modified_blob_path)
        
        with open(temp_output_name, 'rb') as modified_file:
            modified_blob.upload_from_file(modified_file)
        
        os.unlink(temp_input_name)
        os.unlink(temp_output_name)
        
        url = modified_blob.generate_signed_url(
            version="v4",
            expiration=3600, 
            method="GET"
        )
        
        return {
            "url": url,
            "status": "success",
        }
    
    except Exception as e:
        logging.error(f"Function error: {str(e)}")
        return {
            "error": str(e),
            "status": "error"
        }
