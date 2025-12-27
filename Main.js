acode.setPluginInit('com.yourname.js-to-html', (baseUrl, $page, cache) => {
    const { commands } = editorManager.editor;

    // 1. Define the Conversion Function
    const convertJsToHtml = () => {
        const jsCode = editorManager.editor.getValue();
        if (!jsCode) {
            window.toast('No code to convert!', 3000);
            return;
        }

        const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS Output</title>
    <style>
        body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
        #console-log { background: #f4f4f4; padding: 10px; border-radius: 5px; margin-top: 20px; font-family: monospace; }
    </style>
</head>
<body>
    <h1>JS to HTML Output</h1>
    <div id="app"></div>
    <div id="console-log"><strong>Console:</strong><br></div>

    <script>
        // Override console.log to show output in the HTML
        const logDiv = document.getElementById('console-log');
        console.log = (...args) => {
            logDiv.innerHTML += args.join(' ') + '<br>';
        };

        try {
            ${jsCode}
        } catch (err) {
            logDiv.innerHTML += '<span style="color:red">Error: ' + err.message + '</span>';
        }
    </script>
</body>
</html>`;

        acode.newFile('generated_preview.html', htmlTemplate);
        window.toast('HTML File Created!', 2000);
    };

    // 2. Add Command (for Command Palette)
    commands.addCommand({
        name: 'js-to-html:convert',
        bindKey: { win: 'Ctrl-Alt-H', mac: 'Command-Alt-H' },
        exec: convertJsToHtml
    });

    // 3. Add UI Button to Header
    const $headerRight = document.querySelector('#header .right');
    const $convertBtn = tag('span', {
        className: 'icon transform', // Using Acode's built-in 'transform' icon
        attr: {
            action: 'convert-js-html',
            title: 'Convert JS to HTML'
        },
        onclick: convertJsToHtml
    });

    $headerRight.prepend($convertBtn);

    // Store button for cleanup
    cache.set('convertBtn', $convertBtn);
});

acode.setPluginUnmount('com.yourname.js-to-html', (cache) => {
    const $convertBtn = cache.get('convertBtn');
    if ($convertBtn) $convertBtn.remove();
    editorManager.editor.commands.removeCommand('js-to-html:convert');
});
      
