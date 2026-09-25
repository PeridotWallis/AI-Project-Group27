# Running Jukebox

Jukebox is a static HTML app. You do not need Node.js, npm, or external packages. You do need Python 3 to serve it over localhost so embedded YouTube players receive a valid page origin.

## macOS: use the launcher

1. Make sure Python 3 is installed. In Terminal, `python3 --version` should print a version.
2. Open the project folder in Finder and double-click `Start Jukebox.command`.
3. The launcher starts a local server if needed and opens Jukebox in your browser. It tries ports 8000 through 8010; the address will look like `http://127.0.0.1:8000/playlist.html`.

If Finder says you do not have permission to execute the command file, open Terminal and run:

```sh
cd "/Users/vaughnwallis/AI-Project-Group27"
/bin/sh "Start Jukebox.command"
```

Running the script through `/bin/sh` avoids Finder's executable-permission handling. The launcher starts the server in the background, so closing the browser does not stop it. The server will stop when the computer restarts or when its Python server process is stopped.

## Start the server manually

If the launcher does not work, open Terminal, move to the project folder, and start Python's built-in server:

```sh
cd "/Users/vaughnwallis/AI-Project-Group27"
python3 -m http.server 8000 --bind 127.0.0.1
```

Keep that Terminal window open, then visit <http://127.0.0.1:8000/playlist.html>. Press `Control+C` in Terminal to stop the manually started server.

If port 8000 is already occupied, choose another port such as 8001 and use that same port in the browser address.

## Notes

- Open `playlist.html` through the `http://127.0.0.1` address, not by opening the file directly. YouTube embeds can fail with Error 153 when the page is opened using a `file://` address.
- Playlists are saved in the browser's local storage on this device. Browser profiles are separate, and each localhost port is a separate origin, so using a different port may show a separate set of playlists.
- `index.html` is a separate Hello World test page. The playlist app is `playlist.html`.