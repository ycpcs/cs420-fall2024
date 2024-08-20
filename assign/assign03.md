---
layout: default
course_number: CS420
title: "Assignment 3: Semaphore Fun"
---



<br>

### About this Assignment

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The goal of this programming assignment is to get you working with semaphores/mutexes. You will write a program that forks off some number of child processes.  Each of those child processes will spawn some number of worker threads.  **All threads from all processes will concurrently attempt to read and then write data to a shared file**.  The reading and writing of this file must be done in a way that does not corrupt the file and produces the desired output.

There are a variety of semaphore implementations that one could use to protect access to shared files and data.  For this assignment, you will utilize **POSIX named semaphores**.  You can read everything you need to know about writing programs that use semaphores and named semaphores [here](https://web.archive.org/web/20161208112748/http://www.linuxdevcenter.com:80/pub/a/linux/2007/05/24/semaphores-in-linux.html). Please read ALL six pages of the linked semaphore documentation before proceeding. The information relevant to this assignment is the section on **POSIX named semaphores** which starts on page 4.


<br>

### Getting Started

 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

After reading the information about programming with semaphores, you can download the assignment files [here](assign03_semaphores.zip).  The assignment is distributed as a **CLion** project that includes multiple run configurations to simplify debugging. 


This assignment includes features such as:
  * automatic cleanup of semaphores that were left behind from a previous run -- a small utility called **`rmsem`** will automatically remove those old semaphores at the start of each new run
  * standalone testing/debugging of child processes (i.e. ability to run the child **`fileWriter`** process without the parent process) -- a shell script called **`fileWriterTestSetup.sh`** automatically establishes a file for the child process to update; this script replicates work done by the **`main`** parent process and is only required when running the child process in standalone mode


<br>

### Your Task

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Your task is to write two programs (**`main`** and **`fileWriter`**).  As noted earlier, **`main`** will fork off many instances of **`fileWriter`** and **`fileWriter`** will spawn many threads.  All threads run concurrently and attempt to access, read, and write a common file. **Your mission, should you choose to accept it, it to ensure orderly access to the common file and to ensure that all threads eventually get a chance to read and write the file.**  

<p style="color:red;">IMPORTANT NOTE:</p>
For the sake of simplicity, it is **highly** recommended that you start by writing the child **`fileWriter`** program. Test and debug that program. Only when you are sure that it works properly, should you move on to writing the parent **`main`** program. You'll find it much easier to debug if you focus on the child **`fileWriter`** program first.


<br>

### Creating the main program

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The **`main`** program must accomplish the following:

 * parse command line arguments (described in more detail below)
 * open and initialize the shared file (filename specified as an input argument)
 * create and initialize the **named semaphore**
 * fork some number of child processes (specified as an input argument)
 * wait for child processes to complete
 * close and cleanup the **named semaphore**


<br>

#### <u>Before you can compile...</u>

You will need to define a name for your **named semaphore**.  Open the **`sem_name.h`** file and assign **`SEM_NAME`** using your **YCP username** as the name for your semaphore. This will make it easier to recognize and cleanup any semaphores you create.


<br>

#### <u>Parsing arguments</u>

Your **`main`** program **MUST** take three command line arguments (**`-p`**, **`-t`**, and **`-f`**) as shown below. The usage statement for your program, with an explanation of each of the command line arguments is below:

<pre>
usage: ./main -p &lt;num_procs&gt; -t &lt;num_threads&gt; -f &lt;filename&gt;
    -p : the number of processes to create
    -t : the number of threads to create per process
    -f : the name of the shared file in which to write output
</pre>

**NOTE** that the **`main`** program requires flags to be passed in from the command line along with the associated values. Using flags makes it possible to pass arguments into a program in any order, or in some cases only pass in a subset of all possible command line arguments. I highly recommend reading about and using the **`getopt`** function that is included in the **`unistd.h`** C library to parse your command line options. The man page for the **`getopt`** function can be found [here](http://pubs.opengroup.org/onlinepubs/009696899/functions/getopt.html#tag_03_234). Using **`getopt`** in the **`main`** program is required to get full credit for this assignment.


<br>

#### <u>Writing the first value</u>

When your **`main`** program is run it should create a new file using the filename specified and write the integer value '**`0`**' (without the quotes) followed by a newline ('**`\n`**') into the first line of the file. It will be the only line in the file for now.  After writing the '0', the main process should close the file. It will be reopened again later. **NOTE:** utility functions called **`open_file`** and **`close_file`** are provided for you in the **`utils.c`** file. Use them to make your lives easier.  These functions accept the same arguments as **`fopen`** and **`fclose`** but they do all of the necessary error checking for you.



<br>

#### <u>Creating a named semaphore</u>

Next, your main process will need to create a **named semaphore**.  A named semaphore is maintained by the operating system and is very easy to share between unrelated processes. There is no need to manually created a shared memory space that would be required of other types of semaphores/mutexes (in other words, you're getting off easy here).  You should have already read about programming with semaphores [here](https://web.archive.org/web/20161208112748/http://www.linuxdevcenter.com:80/pub/a/linux/2007/05/24/semaphores-in-linux.html).

To define the name for your **named semaphore** (if you haven't already done so), open the **`sem_name.h`** file and assign **`SEM_NAME`** using your **YCP username** as the name for your semaphore.  This will make it easier to recognize and cleanup any semaphores you create.

When working with **named semaphores**, be sure that you destroy the semaphore prior to terminating your program.  You need to destroy the semaphore before your program exits normally.  You also need to destroy the semaphore before your program exits with an error.

**NOTE:** While debugging your code, you may end up in a situation where you've created and locked the named semaphore and neglected to unlock or delete the semaphore prior to exiting.  For a named semaphore that is managed by the operating system, this means that the next time you attempt to run your program you won't be able to acquire the semaphore and your program will block.

A small utility program will automatically execute each time you run your program.  This utility checks for and removes any semaphore that you created in previous runs so those leftover semaphores don't interfere with the current run.  The utility is included as **`rmsem.c`** and can be run manually if you find the need. 

To manually run **`rmsem`**, type the following in your terminal:

<pre>
./rmsem -s "your_semaphore_name"
</pre>

Alternatively, if you set your semaphore name in **`sem_name.h`** you can run **`rmsem`** as follows from your terminal:

<pre>
./rmsem
</pre>

The utility outputs a message to indicate if the semaphore existed and if it was successfully removed.



<br>

#### <u>Creating child processes</u>

Your **`main`** process should create **`P`** new child processes (number specified via the **`-p`** option on the command line) that **run concurrently** (i.e. fork off ALL processes before calling **`wait(NULL)`** and waiting for any to finish). **DO NOT WAIT FOR A PROCESS TO FINISH BEFORE FORKING THE NEXT PROCESS!** 

Each child process should replace its process contents with a call to **`execlp`** and run the program **`fileWriter`**.  When creating a **`fileWriter`** process, you need to pass the following arguments: (1) the number of threads you want the process to create, and (2) the filename that the **`fileWriter`** process will read/write.  Both of these values are provided as arguments to the **`main`** process.  You can just pass them along to the **`fileWriter`** process. You can fill in the code in **`fileWriter.c`** later. However, **BEFORE** proceeding with the code for **`fileWriter.c`**, you should simply have **`fileWriter.c`** print out a ```"Hello World"``` message. This will allow you to test that your **`main.c`** is properly creating each of the required child processes. 



<br>

### Creating the fileWriter Program

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The **`fileWriter`** program must accomplish the following:

 * parse command line arguments (described in more detail below)
 * create and initialize the named semaphore (when forked from **`main`** the **`fileWriter`** process will simply need to open the **named semaphore** -- however, the code to create/initialize is the same as the code to open)
 * spawn some number of worker threads (specified as input argument **`argv[1]`**)
 * in each thread -- open, read, then write the shared file (filename specified as input argument **`argv[2]`**)
 * wait for worker threads to complete
 * close the **named semaphore**



<br>

#### <u>Parsing arguments</u>

Your **`fileWriter`** program takes two command line arguments. The usage statement for **`fileWriter`**, with an explanation of each command line argument is below:

<pre>
usage: ./fileWriter &lt;num_threads&gt; &lt;filename&gt;
    &lt;num_threads&gt; : the number of threads to create
    &lt;filename&gt;    : the name of the shared file to read and write
</pre>

**NOTE** that the **`fileWriter`** program accepts arguments as bare arguments in **`argv[1]`** and **`argv[2]`**.  There are no flags associated with the arguments as is done in some programs (e.g. no **`-t`** or **`-f`** as in **`main`**). Since there are no flags, the arguments must be passed into **`fileWriter`** in the exact order specified above.


<br>

#### <u>Opening a named semaphore</u>

Your **`fileWriter`** process will need to create/open a **named semaphore**.  As described earlier, a named semaphore is maintained by the operating system and is very easy to share between unrelated processes. You should have already read about programming with semaphores [here](https://web.archive.org/web/20161208112748/http://www.linuxdevcenter.com:80/pub/a/linux/2007/05/24/semaphores-in-linux.html).

To define the name for your **named semaphore** (if you haven't already done so), open the **`sem_name.h`** file and assign **`SEM_NAME`** using your **YCP username** as the name for your semaphore.  This will make it easier to recognize and cleanup any semaphores you create.

When opening your **named semaphore** in **`fileWriter`**, you can open it in the same way that you opened in it in **`main`**.  That includes setting the initial value to **1**.  In the case that **`fileWriter`** is forked from **`main`**, attempts to initialize the existing semaphore will not have any effect.  In the case that you are debugging and want to run **`fileWriter`** as a standalone program, the semaphore will be both **created and initialized** so it can be used throughout the rest of **`fileWriter`**.

**IMPORTANT NOTE:** Proper handling of a **named semaphore** requires that the semaphore is destroyed when you are done using it.  This should be done in **`main`** and **NOT** in **`fileWriter`**.  If one **`fileWriter`** process destroys the semaphore it will not be available for any of the other **`fileWriter`** processes.  This means that when you are debugging and run **`fileWriter`** as a standalone process the **named semaphore** will **NOT** get destroyed!  However, as described earlier your **named semaphore** will get destroyed by the **rmsem** utility distributed with the assignment.

To manually run **`rmsem`**, type the following in your terminal:

<pre>
./rmsem -s "your_semaphore_name"
</pre>

Alternatively, if you set your semaphore name in **`sem_name.h`** you can run **`rmsem`** as follows from your terminal:

<pre>
./rmsem
</pre>

The utility outputs a message to indicate if the semaphore existed and if it was successfully removed.



<br>

#### <u>Creating threads</u>

Your **`fileWriter`** process must spawn **`T`** new threads that all **run concurrently** (i.e. spawn ALL threads before calling **`pthread_join`** and waiting for any to finish).  The value **`T`** is passed into the **`fileWriter`** process as **`argv[1]`**.  **DO NOT WAIT FOR A THREAD TO FINISH BEFORE SPAWNING THE NEXT THREAD!**

When first creating your threads, don't attempt to make them do any work just yet.  Simply get the creation and termination of the threads working properly.  At this point, the function that your threads execute should simply print something simple to the terminal.

Here are a few links that should help you along the way:

 * [POSIX Threads ('pthreads') Reference](http://en.wikipedia.org/wiki/POSIX_Threads)
 * [pthread.h](http://pubs.opengroup.org/onlinepubs/007908799/xsh/pthread.h.html)



<br>

#### <u>Processing File / Worker Thread Function</u>

If you're reading this, your **`fileWriter`** program should be able to successfully create threads and terminate threads.  **IF YOUR CODE DOES NOT DO THESE THINGS DO NOT CONTINUE. YOU SHOULD GET THOSE PIECES WORKING FIRST.**

It's time to make the worker routine for your threads actually do some work.  Each of your threads should attempt to read from and write to the same file that was originally created by the **`main`** process (or by the setup scripts when running **`fileWriter`** as a standalone program). Each thread should:

 * Attempt to open the shared file
 * Read the **LAST** numeric value in the file (the first thread to access the file will read the 0 written by the **`main`** process)
 * Increment the value read from the file and **append** the newly incremented value to the file. Each newly appended value should be appended on its own line in the shared file


Use your **named semaphore** as necessary to protect access to the file, the shared resource. When all the threads complete and all the processes terminate the shared file should contain the numeric values **`0`** through **`(P * T)`**,  *IN ASCENDING ORDER*.  If your values are not in ascending order, or if some of the values are repeated/missing then you should re-evaluate how you are using semaphores because you've made a mistake somewhere.

**File Processing Tips:**

 * There are many different ways to read/write files.  Consider using the following functions **``fseek``**, **``ftell``**, **``getc``**, and **``fscanf``**.  Read the **`man`** pages for these functions and use them as appropriate.
 * **Do NOT** read the entire file with each new thread as that will give you **O(n^2)** behavior.  Instead, consider **jumping** to the end of the file using **`fseek`** and then walking backwards to find the last line.



<br>

### Running your Program

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

This assignment is distributed as a **CLion** project but also includes a standard **`Makefile`**.  Using **CLion** to develop and debug your assignment is recommended.  However, prior to submission verify that your assignment runs properly with the **`Makefile`** test described below.

The **CLion** project contains multiple preset run configurations.  The different configurations run either **`main`** or **`fileWriter`** with different parameters. To ease debugging, the **`fileWriter`** process can be run as a standalone process without it being forked from **`main`**.  

If preferred, you can use **`make`** from the terminal.  The **`Makefile`** provided contains a command that will run and test your code. Your submission **MUST** run correctly when the following **`Makefile`** command is run, regardless of how you developed it:

<pre>
make mainTest
</pre>

You can also run **`fileWriter`** as a standalone process with the following command:

<pre>
make fileWriterTest
</pre>


Running your program in either **CLion** or with the **`Makefile`** will print a status message to your terminal window.  If your program runs and produces the correct output file, it will print out **`-SUCCESS-`**.  If your program does not produce the correct output file, it will print out **`-EPIC FAIL-`**.  Additionally, a second test will check to see if your semaphore has been properly cleaned up.  If not, a second status message will indicate success or failure.  The functions to verify your output file and semaphore cleanup are included in **`verify.c`**.  The code to call these functions is already included in **`main.c`** and **`fileWriter.c`**.  **DO NOT MODIFY THE VERIFICATION FUNCTIONS OR THE CODE THAT CALLS THE VERIFICATION FUNCTIONS.**



<br>

### Sample Output File

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

If your program is run with **`-p 5`** and **`-t 3`**, you should create a total of **5 ```fileWriter``` processes**, each with **3 threads**. That's a **total of 15 threads** that are trying to access and write to the shared file. If successful, the contents of the shared file should look **EXACTLY** like the following when all 15 threads get done with it. The very first line of the file should contain the **0** written by the **`main`** processes, followed by each additional value on a newline.

<pre>
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
</pre>


<br>

### Grading Criteria
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

This assignment will be graded on a 100 point scale as follows: 

 **main process:**
 - **5 points** : correctly parse and error check command line arguments
 - **5 points** : successfully used **getopt** to parse arguments
 - **5 points** : successfully writes the initial '0' to the file
 - **10 points** : correctly creates a named semaphore
 - **10 points** : correctly forks P new processes
 - **5 points** : correctly executes child process
 - **10 points** : correctly closes named semaphore
 
**fileWriter process:**
 - **5 points** : correctly receives arguments passed from main process
 - **5 points** : correctly attaches to named semaphore
 - **10 points** : correctly spawns T new threads
 - **5 points** : correctly locks/unlocks semaphore as necessary
 - **5 points** : threads open, read from, and write to the shared file
 - **5 points** : all data is written correctly to the shared data file
 - **10 points** : data is written to file WITHOUT re-reading every line with every thread
 - **5 points** : correctly closes named semaphore

You may lose additional points for writing bad code (e.g. not checking error conditions, not closing files when you're done with them, etc.).


<br>

### Submission

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Before submitting your assignment:
 1. run **`make clean`** from the terminal
 2. run **`make`** to compile your code from scratch
 3. **ADDRESS ANY AND ALL WARNINGS**
 4. goto #1 until no more warnings exist

There are **NO** acceptable warnings on this assignment or any other assigning in this course. All warnings are an indication that you've done something incorrectly.



When you are done, run the following command from your terminal in the source directory for the project:

	make submit

You will be prompted for your Marmoset username and password,
which you should have received by email.  Note that your password will
not appear on the screen.

**DO NOT MANUALLY ZIP YOUR PROJECT AND SUBMIT IT TO MARMOSET.  
YOU MUST USE THE ```make submit``` COMMAND.**

