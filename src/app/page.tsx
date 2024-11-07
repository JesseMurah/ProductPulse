import Link from "next/link";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/app/_components/LoginForm";
import CompanyDataVisualization from "@/app/_components/CompanyDataVisualization";

export default async function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary">
            Company Data <span className="text-primary">Visualizer</span>
          </h1>

          {!session ? (
            <LoginForm />
          ) : (
            <div className="w-full max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {session.user?.name}</CardTitle>
                  <CardDescription>
                    Explore and manage your company data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CompanyDataVisualization />
                  <div className="mt-4 flex justify-between">
                    <Link href="/dashboard">
                      <Button>Go to Dashboard</Button>
                    </Link>
                    <Link href="/api/auth/signout">
                      <Button variant="outline">Sign out</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Visualize Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Explore interactive visualizations of company data, including ethics, price, and quality ratings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Add, edit, and remove company information. Keep your database up-to-date with the latest data.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>About Company Data Visualizer</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Company Data Visualizer is a powerful tool for analyzing and managing company information.
                With interactive charts and easy data management, it's the perfect solution for keeping
                track of company ethics, pricing, and quality ratings.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </HydrateClient>
  );
}