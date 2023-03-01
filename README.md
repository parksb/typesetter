# Typesetter

![Mural mosaic "Typesetter" at John A. Prior Health Sciences Library in Ohio](https://user-images.githubusercontent.com/6410412/190851050-a01c1b0d-9900-4271-8cda-1594453bffa5.png)

_Mural mosaic "Typesetter" at John A. Prior Health Sciences Library in Ohio (CC BY-SA 3.0)_

```sh
$ cd ~
$ git clone https://github.com/parksb/typesetter.git
$ cd typesetter
```

```sh
# Add the following lines to the shell config file, such as `~/.zshrc` or `~/.bashrc`
export TYPESETTER_PATH="$HOME/typesetter"
export PATH="$PATH:$TYPESETTER_PATH/bin"

# If you're using a fish shell, just run the following scripts
$ set -Ux TYPESETTER_PATH "$HOME/typesetter"
$ fish_add_path "$TYPESETTER_PATH/bin"
```

```sh
$ ls
text.md

$ typeset html text.md

$ ls
text.md text.html

$ typeset pdf text.md

$ ls
text.md text.html text.pdf
```
