// "use client";

// import { useState, useEffect } from "react";
// import { initializeFirebase, functions } from "../firebaseConfig";
// import { httpsCallable, HttpsCallableResult } from "firebase/functions";

// type HelloWorldResponse = {
//   message: string;
// };

// export default function TestPage() {
//   const [result, setResult] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     initializeFirebase();
//   }, []);

//   const callFunction = async () => {
//     const helloWorldFunction = httpsCallable<unknown, HelloWorldResponse>(
//       functions,
//       "hello_world"
//     );
//     try {
//       console.log("Calling hello_world function...");
//       const result: HttpsCallableResult<HelloWorldResponse> =
//         await helloWorldFunction();
//       console.log("Function call result:", result);
//       setResult(result.data.message);
//     } catch (error) {
//       console.error("Error calling function:", error);
//       setError(
//         error instanceof Error ? error.message : "An unknown error occurred"
//       );
//     }
//   };

//   return (
//     <div>
//       <button onClick={callFunction}>Call Hello World Function</button>
//       {result && <p>Result: {JSON.stringify(result)}</p>}
//       {error && <p>Error: {error}</p>}
//     </div>
//   );
// }

import LinkButton from "../ui/link-button";

export default function Page() {
  return (
    <main className="landing-page">
      <h2>Welcome to dutycalc</h2>
      <LinkButton label="Generate return" type="accent" url="/guest-return" />
    </main>
  );
}
