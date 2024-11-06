import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
