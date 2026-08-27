import { SITE_URL } from "@/lib/site";

export function DomainRedirect() {
  // If accessed from *.pages.dev, immediately redirect to custom domain https://tilestencil.com preserving path & query
  const redirectScript = `if(typeof window!=="undefined"&&window.location.hostname.endsWith(".pages.dev")){window.location.replace("${SITE_URL}"+window.location.pathname+window.location.search+window.location.hash);}`;

  return (
    <script
      id="canonical-domain-redirect"
      dangerouslySetInnerHTML={{ __html: redirectScript }}
    />
  );
}
