"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}


// // src/components/Providers.jsx
// "use client";

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useState } from 'react';

// export default function Providers({ children }) {
//   // We use useState to ensure the QueryClient is only created once per session
//   const [queryClient] = useState(() => new QueryClient({
//     defaultOptions: {
//       queries: {
//         // This prevents unnecessary re-fetches when you switch tabs
//         staleTime: 60 * 1000, 
//       },
//     },
//   }));

//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//     </QueryClientProvider>
//   );
// }