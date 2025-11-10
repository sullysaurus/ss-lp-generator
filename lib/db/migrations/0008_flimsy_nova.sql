CREATE TABLE IF NOT EXISTS "PromptTest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"title" text NOT NULL,
	"prompt" text NOT NULL,
	"model" varchar(50) NOT NULL,
	"settings" jsonb,
	"guide1Output" text,
	"guide2Output" text,
	"guide3Output" text,
	"commentary" text,
	"iteration" varchar(50)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PromptTest" ADD CONSTRAINT "PromptTest_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
