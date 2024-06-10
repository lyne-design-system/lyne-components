export async function loadAssetAsBase64(url: string): Promise<string> {
  return URL.createObjectURL(await fetch(url).then((r) => r.blob()));
}
