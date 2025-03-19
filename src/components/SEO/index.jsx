import React from "react"
import { Helmet } from "react-helmet"
import { siteUrl } from "../../../blog-config"

const SEO = ({ title, description, url }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={`${siteUrl}/og-image.png`} />
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      <meta name="google-site-verification" content="j2VJwK72EAE7f-I_VEkDnHN2xl_FIDOI-s97GYm9Zg4" />
    </Helmet>
  )
}

export default SEO
