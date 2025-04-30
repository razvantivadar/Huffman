function getFrequencies(text) {
  const freq = {};
  for (let char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}

function buildHuffmanTree(freq) {
  const nodes = Object.entries(freq).map(([char, freq]) => ({ char, freq }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const newNode = {
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
    };
    nodes.push(newNode);
  }

  return nodes[0];
}

function generateCodes(tree, prefix = "", codeMap = {}) {
  if (!tree.left && !tree.right) {
    codeMap[tree.char] = prefix;
  } else {
    generateCodes(tree.left, prefix + "0", codeMap);
    generateCodes(tree.right, prefix + "1", codeMap);
  }
  return codeMap;
}

function encode(text, codeMap) {
  return text.split("").map((char) => codeMap[char]).join("");
}

function compress() {
  const input = document.getElementById("inputText").value;

  if (!input.trim()) {
    alert("Please enter some text.");
    return;
  }

  // Step 1: Frequency analysis
  const freq = getFrequencies(input);

  // Step 2: Huffman tree & codes
  const tree = buildHuffmanTree(freq);
  const codes = generateCodes(tree);

  // Step 3: Encode input
  const encoded = encode(input, codes);

  // Step 4: Show encoded output
  document.getElementById("encoded").textContent = encoded;

  // Step 5: Show compression rate
  const originalBits = input.length * 8;
  const compressedBits = encoded.length;
  const rate = ((1 - compressedBits / originalBits) * 100).toFixed(2);
  document.getElementById("rate").textContent = `${rate}% (from ${originalBits} bits to ${compressedBits} bits)`;

  // Step 6: Render Huffman code table
  const tableBody = document.getElementById("codesBody");
  tableBody.innerHTML = ""; // Clear previous

  Object.keys(codes).forEach(char => {
    const row = document.createElement("tr");
    const charCell = document.createElement("td");
    const codeCell = document.createElement("td");

    // Beautify special characters
    let displayChar = char;
    if (char === " ") displayChar = "[space]";
    else if (char === "\n") displayChar = "[newline]";
    else if (char === "\t") displayChar = "[tab]";

    charCell.textContent = displayChar;
    codeCell.textContent = codes[char];

    row.appendChild(charCell);
    row.appendChild(codeCell);
    tableBody.appendChild(row);
  });
}


