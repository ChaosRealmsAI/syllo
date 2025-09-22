'use client';

import { SupabaseToc } from '@/components/supabase-toc';

export default function SupabaseTocPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header
        className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border"
        style={{ height: 'var(--header-height, 50px)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                Supabase Documentation
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              TOC Demo
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Left sidebar with TOC */}
          <SupabaseToc />

          {/* Main Content */}
          <main className="flex-1 py-8">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              {/* Features Section */}
              <section id="features" className="mb-16">
                <h1 className="text-4xl font-bold mb-6">Features</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Supabase provides a complete set of tools to build and manage your database,
                  authentication, storage, and real-time subscriptions.
                </p>

                {/* Table view */}
                <div id="table-view" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">Table view</h2>
                  <p className="text-muted-foreground mb-4">
                    The Table Editor provides a simple interface for viewing and editing your data.
                    You can browse your tables, edit rows, and manage your database schema
                    all from a friendly UI.
                  </p>
                  <div className="bg-muted p-6 rounded-lg mb-6">
                    <pre className="text-sm">
                      <code>{`-- View all users
SELECT * FROM users;

-- Add a new user
INSERT INTO users (name, email)
VALUES ('John Doe', 'john@example.com');`}</code>
                    </pre>
                  </div>
                  <p className="text-muted-foreground">
                    The table view also supports advanced features like filtering, sorting,
                    and bulk operations to help you manage large datasets efficiently.
                  </p>
                </div>

                {/* Relationships */}
                <div id="relationships" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">Relationships</h2>
                  <p className="text-muted-foreground mb-6">
                    Supabase automatically detects relationships between your tables based on
                    foreign keys. This allows you to easily navigate between related data
                    and understand your database structure.
                  </p>
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <pre className="text-sm">
                      <code>{`-- Create tables with relationships
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  username TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);`}</code>
                    </pre>
                  </div>
                </div>

                {/* Clone tables */}
                <div id="clone-tables" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">Clone tables</h2>
                  <p className="text-muted-foreground mb-4">
                    Easily duplicate existing tables with all their structure, indexes,
                    and constraints. This is useful for creating staging environments
                    or testing new schema changes.
                  </p>
                </div>

                {/* The SQL editor */}
                <div id="the-sql-editor" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">The SQL editor</h2>
                  <p className="text-muted-foreground mb-4">
                    Write and execute SQL queries directly in the dashboard. The SQL editor
                    includes syntax highlighting, autocomplete, and query history to help
                    you work more efficiently.
                  </p>
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <pre className="text-sm">
                      <code>{`-- Complex query with joins
SELECT
  u.email,
  p.username,
  COUNT(posts.id) as post_count
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN posts ON u.id = posts.author_id
GROUP BY u.id, u.email, p.username
ORDER BY post_count DESC;`}</code>
                    </pre>
                  </div>
                </div>

                {/* Additional features */}
                <div id="additional-features" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">Additional features</h2>
                  <p className="text-muted-foreground mb-4">
                    Beyond the core database functionality, Supabase provides many additional
                    features including real-time subscriptions, storage buckets, edge functions,
                    and comprehensive APIs.
                  </p>
                </div>

                {/* Extensions */}
                <div id="extensions" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">Extensions</h2>
                  <p className="text-muted-foreground mb-4">
                    Supabase supports PostgreSQL extensions to extend your database functionality.
                    Popular extensions include PostGIS for geospatial data, pg_cron for scheduled jobs,
                    and many more.
                  </p>
                </div>
              </section>

              {/* Terminology Section */}
              <section id="terminology" className="mb-16">
                <h1 className="text-4xl font-bold mb-6">Terminology</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Understanding key terms and concepts in Supabase will help you get the most
                  out of the platform.
                </p>

                {/* Postgres or PostgreSQL? */}
                <div id="postgres-or-postgresql" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">Postgres or PostgreSQL?</h2>
                  <p className="text-muted-foreground mb-4">
                    Both terms refer to the same database system. "PostgreSQL" is the official name,
                    while "Postgres" is a commonly used nickname. Supabase is built on PostgreSQL,
                    providing you with the full power of this advanced database system.
                  </p>
                </div>
              </section>

              {/* Tips Section */}
              <section id="tips" className="mb-16">
                <h1 className="text-4xl font-bold mb-6">Tips</h1>
                <div className="space-y-6 text-muted-foreground">
                  <p>
                    Here are some pro tips to help you get the most out of Supabase:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use Row Level Security (RLS) to secure your data at the database level</li>
                    <li>Take advantage of real-time subscriptions for live updates</li>
                    <li>Use the built-in authentication system to handle user management</li>
                    <li>Leverage PostgreSQL extensions for advanced functionality</li>
                    <li>Use the Dashboard's SQL editor to prototype and test queries</li>
                  </ul>
                </div>
              </section>

              {/* Next steps Section */}
              <section id="next-steps" className="mb-16">
                <h1 className="text-4xl font-bold mb-6">Next steps</h1>
                <div className="space-y-6 text-muted-foreground">
                  <p>
                    Ready to dive deeper into Supabase? Here are some recommended next steps:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Set up your first project in the Supabase dashboard</li>
                    <li>Create your database schema using the Table Editor</li>
                    <li>Configure authentication for your application</li>
                    <li>Implement real-time features using subscriptions</li>
                    <li>Deploy your application using Supabase's deployment tools</li>
                  </ol>
                  <p>
                    Don't forget to check out our comprehensive documentation and community
                    resources for additional help and inspiration.
                  </p>
                </div>
              </section>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}