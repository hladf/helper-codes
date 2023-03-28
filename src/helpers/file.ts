import { HttpClient } from 'components';

export async function downloadFile(
  uri: string,
  fileNameDownload: string,
  method?: 'POST' | 'GET'
) {
  const { data } = await HttpClient(uri, {
    responseType: 'blob',
    method: method || 'GET',
  });
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileNameDownload);
  document.body.appendChild(link);
  link.click();
};
