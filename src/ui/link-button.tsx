import Link from 'next/link';

interface LinkButtonProps {
    label : string;
    type?: 'accent' | 'urgent';
    url: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ label, type = 'accent', url }) => {
    return (
        <Link href={url} className={`link-button ${type}`}>
            {label}
        </Link>
    );
};

export default LinkButton;