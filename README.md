# HeadChat

HeadChat is a small chatting application that matches you with strangers. It
came from a short experiment of mine to see what I could create given a few
weeks of free time while on holiday. It's not really supposed to be hosted
anywhere, and I haven't really thoroughly debugged it all - however, it taught
me a lot, thereby serving its purposes.

## Installing

    git clone https://github.com/jedevc/HeadChat.git
    cd HeadChat
    npm install
    npm start

## Folder strucutre

- **/**
    - Whole bunch of stuff for package management, a few markdown files and
    the entry point for the whole application.
- **bin/**
    - Scripts for doing different things.
- **config/**
    - Configuration for application internals.
- **controllers/**
    - Routes for express and handlers for socket.io.
- **public/**
    - Files to be served to the client or used to generate files to be served
    to the client
- **views/**
    - Pug templates for rendering html pages.

## Technologies

HeadChat is my first real attempt at trying to build a server in nodejs. I ended
up deciding on using express due to its utter simplicity.

- Server side
    - Express
    - Pug
    - Socket.io
- Client side
    - VueJS and Vue single file components
    - Babel
    - Less
    - Browserify

## License

HeadChat is licensed under the MIT License. See
[LICENSE.md](https://github.com/jedevc/HeadChat/blob/master/LICENSE.md) for more
details.
