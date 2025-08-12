import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

export default function AuthButtons() {
  return (
    <>
      <SignedOut>
        <SignInButton>
          <button>Sign in</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton>
          <button>Sign out</button>
        </SignOutButton>
      </SignedIn>
    </>
  );
}
