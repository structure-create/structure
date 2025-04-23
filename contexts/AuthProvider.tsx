"use client";

import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-west-1.amazonaws.com/us-west-1_TIKNitkEF",
  client_id: "5u1cfh5oh8qm165bvrseutamnr",
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net", // your deployed domain
  response_type: "code",
  scope: "openid email phone",
};

export function CognitoProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}