import { SignIn } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export default function Page({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const redirectUrl: string | undefined = searchParams["redirectUrl"]
  return (
    <Center p={4}>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#38B2AC",
          }
        }}
        redirectUrl={redirectUrl}
      />
    </Center>
  );
}
