"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { site } from "@/content/site";

/**
 * Contact form with no backend: submitting composes a prefilled email in the
 * visitor's own mail app (mailto:). Honest and zero-infrastructure — swap for
 * a form endpoint later if one is added.
 */
export function ContactSection() {
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(senderName ? `Hi Ashesh — ${senderName}` : "Hi Ashesh");
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${site.primary_email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader eyebrow="SAY HI" title="Let's build something" />
      <Card tint="sun" padding={28}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            label="Your name"
            placeholder="Ada Lovelace"
            value={senderName}
            onChange={(event) => setSenderName(event.target.value)}
          />
          <Input
            label="Message"
            multiline
            placeholder="What are you building?"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            hint="Opens your mail app with everything prefilled — no tracking, no backend."
          />
          <div>
            <Button type="submit" size="md">
              Send it →
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
