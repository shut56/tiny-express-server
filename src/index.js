<!DOCTYPE html>
<html>
  <head>
    <title>Tiny Express Server</title>
    <script defer>
      fetch(/).then((r) => r.json()).then((data) => {
            const root = document.getElementById('root')
            root.textContent = data            
      })
    </script>
  </head>
<body>
  <div id="root"></div>
</body>
</html>
