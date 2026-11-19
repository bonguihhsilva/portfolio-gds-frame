import Script from "next/script";

/**
 * Webchat do Botpress. As duas URLs vêm do snippet "Embed" do bot no Botpress Studio
 * e são lidas em runtime (não precisam estar no build). Sem elas, o chat simplesmente não aparece.
 */
export function BotpressWebchat() {
  const inject = process.env.BOTPRESS_INJECT_URL;
  const config = process.env.BOTPRESS_CONFIG_URL;
  if (!inject || !config) return null;

  return (
    <>
      <Script src={inject} strategy="afterInteractive" />
      <Script src={config} strategy="afterInteractive" />
    </>
  );
}
