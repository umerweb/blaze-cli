import { useState, useEffect, useRef } from 'react';

const Cli = () => {
  const [input, setInput] = useState('');
  const [oldcmd, setOldCmd] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [directories, setDirectories] = useState({
    '/': ['home', 'about', 'contact'],
    '/home': ['file1.txt', 'file2.txt'],
    '/about': [],
    '/contact': []
  });
  const [showError, setShowError] = useState(false);

  const spanRef = useRef(null);
  const inputRef = useRef(null);
  const andir = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input !== '') {
        let cmdoutput = '';

        if (input.trim() === 'h' || input === 'help') {
          cmdoutput = `
            <div class='text-white font text-sm font-normal'>
              Enter [ls] to see files <br />
              Enter [cd &lt;#<span class='font text-sm font-normal text-yellow-600'>dir</span>&gt;] to navigate<br />
              Enter [cd ..] to go back<br />
              
              Enter [hello &lt;#<span class='font text-sm font-normal text-yellow-600'>message</span>&gt; to display a message<br />
              Enter [heck] to heck NASA
            </div>`;
          setOldCmd((prevItems) => [...prevItems, { input: input, output: cmdoutput }]);

        } else if (input.trim() === 'ls') {
          const files = directories[currentDirectory].join(' ');
          cmdoutput = `<p class="text-yellow-600 font text-sm font-normal">${files}</p>`;
          setOldCmd((prevItems) => [...prevItems, { input: input, output: cmdoutput }]);

        } else if (input.startsWith('cd ')) {
          const dir = input.substring(3).trim();
          if (dir === '..') {
            const parentDir = currentDirectory === '/' ? '/' : currentDirectory.substring(0, currentDirectory.lastIndexOf('/')) || '/';
            setCurrentDirectory(parentDir);
            cmdoutput = `<p class="text-yellow-600 font text-sm font-normal">Changed to directory: ${parentDir}</p>`;
          } else if (directories[currentDirectory].includes(dir)) {
            const newDir = currentDirectory === '/' ? `/${dir}` : `${currentDirectory}/${dir}`;
            setCurrentDirectory(newDir);
            cmdoutput = `<p class="text-yellow-600 font text-sm font-normal">Changed to directory: ${newDir}</p>`;
          } else {
            cmdoutput = `<span class="text-red-500 font text-sm font-normal"> Error: Directory not found</span>`;
          }
          setOldCmd((prevItems) => [...prevItems, { input: input, output: cmdoutput }]);

        } else if (input.startsWith('hello ')) {
          window.alert(input.substring(6));
          cmdoutput = `<p class="text-yellow-600 font text-sm font-normal">acknowledged</p>`;
          setOldCmd((prevItems) => [...prevItems, { input: input, output: cmdoutput }]);

        } else if (input.trim().toLowerCase() === 'heck') {
          setShowError(true);
          cmdoutput = `<p class="text-yellow-600 font text-sm font-normal">Heck nasa command executed!</p>`;
          setOldCmd((prevItems) => [...prevItems, { input: input, output: cmdoutput }]);
          
        } else {
          cmdoutput = `<span class="text-red-500 font text-sm font-normal"> Error: ${input} not recognized as internal or external command</span>`;
          setOldCmd((prevItems) => [...prevItems, { input: input, output: cmdoutput }]);
        }

        setInput('');
      } else {
        setInput('');
      }
    }
  };

  useEffect(() => {
    document.getElementById('cli-input').focus();
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (spanRef.current && inputRef.current && andir.current) {
      const w = andir.current.offsetWidth;
      const newWidth = spanRef.current.offsetWidth + w;
      inputRef.current.style.marginLeft = `${newWidth}px`;
    }
  }, [input]);

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className="flex bg h-screen w-screen justify-center items-center">
      <div className="flex min-h-[90vh] flex-col min-w-[90vw] max-w-[90vw] md:min-w-[45vw] md:max-w-[45vw] bor p-5 bg-black overflow-y-auto">
        <p className="text-white font text-sm font-normal">Welcome to BLAZE CLI 1.1.0</p>
        <p className="text-white font text-sm pb-3 font-normal">Enter <span className='text-yellow-600'>[h, help] </span>to see commands</p>
        {oldcmd.map((cmd, index) => (
          <div key={index}>
            <p className='text-slate-400 break-words text-wrap font min-h-5 text-sm font-normal'>{cmd.input}</p>
            <div
              className='text-white break-words text-sm font-normal'
              dangerouslySetInnerHTML={{ __html: cmd.output }}
            ></div>
          </div>
        ))}

        <div className="flex min-h-6 flex-nowrap relative min-w-[100%] text-wrap justify-start items-start">
          <span ref={andir} className='text-white pr-2 font text-sm font-normal'>{`${currentDirectory} ~>>`}</span>
          <input
            id="cli-input"
            type="text"
            value={input}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            className="bg-black min-w-[75%] pt-[2px] text-sm font resize-none outline-none border-none min-h-5 text-white"
          />
          <div ref={inputRef} className="flex justify-end absolute items-end min-h-6">
            <div className="cursor"></div>
          </div>
        </div>
      </div>
      <span
        ref={spanRef}
        className="absolute font text-sm font-normal invisible left-0 top-0 text-white"
      >
        {input}
      </span>
      
      {showError && (
        <div className="fixed inset-0 bg-red-600 flex justify-center items-center flex-col text-white text-3xl">
          <div className='font font-bold'>Error: FBI open your door!💀</div>
          
        </div>
      )}
    </div>
  );
};

export default Cli;
