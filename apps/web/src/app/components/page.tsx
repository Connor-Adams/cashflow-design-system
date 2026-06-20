import * as React from 'react'
import manifest from '../../generated/manifest.json'
import { Gallery, type ManifestEntry } from '../../components/Gallery'

export default function ComponentsPage() {
  return <Gallery entries={manifest as ManifestEntry[]} />
}
