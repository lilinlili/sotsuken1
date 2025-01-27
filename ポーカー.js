// ファイルの読み込み例
const input = document.getElementById('fileInput');
input.addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    // ワークブックの操作
  };
  reader.readAsArrayBuffer(file);
});
