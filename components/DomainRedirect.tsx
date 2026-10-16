import { SITE_URL } from "@/lib/site";

export function DomainRedirect() {
  // If accessed from the production tilestencil.pages.dev host, redirect to https://tilestencil.com preserving
  // path & query. Branch previews (e.g. paytest.tilestencil.pages.dev) are left alone so they can be tested.
  const redirectScript = `if(typeof window!=="undefined"&&window.location.hostname==="tilestencil.pages.dev"){window.location.replace("${SITE_URL}"+window.location.pathname+window.location.search+window.location.hash);}`;

  return (
    <script
      id="canonical-domain-redirect"
      dangerouslySetInnerHTML={{ __html: redirectScript }}
    />
  );
}
