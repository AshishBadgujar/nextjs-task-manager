"use client";
import {
    ApolloLink,
    HttpLink,
    SuspenseCache,
} from "@apollo/client";
import {
    ApolloNextAppProvider,
    NextSSRInMemoryCache,
    SSRMultipartLink,
    NextSSRApolloClient,
} from "@apollo/experimental-nextjs-app-support/ssr";

const GRAPHQL_ENDPOINT = process.env.NODE_ENV == "production" ? `https://task-manager-ashish.vercel.app/api/graphql` : "http://localhost:3000/api/graphql"


function makeClient() {
    const httpLink = new HttpLink({
        uri: GRAPHQL_ENDPOINT,
    });

    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([
                    // in a SSR environment, if you use multipart features like
                    // @defer, you need to decide how to handle these.
                    // This strips all interfaces with a `@defer` directive from your queries.
                    new SSRMultipartLink({
                        stripDefer: true,
                    }),
                    httpLink,
                ])
                : httpLink,
    });
}

function makeSuspenseCache() {
    return new SuspenseCache();
}

export function ApolloWrapper({ children }) {
    return (
        <ApolloNextAppProvider
            makeClient={makeClient}
            makeSuspenseCache={makeSuspenseCache}
        >
            {children}
        </ApolloNextAppProvider>
    );
}
