# Initialization_Steps :

1. Install [Node.js](https://www.nodejs.org/en/download/).

2. Check the success of the installation by running the following command at the terminal/command line:

        >node -v 
        >v10.16.0   (~Expected output)

    If the terminal/command line throws an error about the command being unrecognized, reinstall [Node.js].

3. [Node.js] comes bundled with [npm], a library manager for [node.js] projects. Check the availability by running the following command at the terminal/command line:
   
        >npm -v
        >6.13.7     (~Expected output)

    If the terminal/command line throws an error about the command being unrecognized, reinstall [Node.js].

4. Assuming [Node.js] and [npm] are installed, navigate to the project directory inside terminal/command line and run the following command:
   
        >npm i

    This command would install the project depedencies and hence generate a client side build for consuming.

5. Assuming the project dependencies are successfully installed, run the following command at the terminal/command line:
   
        >npm start
    
    The project fires up at port [8888].
    Inside the web browser, preferrably [GoogleChrome], navigate to [localhost:8888] and the project build should be available to use.
    
# Ouput for the sample bit stream : 1 0 0 1 1 0 1 0

![Alt SampleOutput](/sampleOutput.png?raw=true "Sample Output")

### P.S. Written in a day. Please don't judge the coding semantics! 😉



    

