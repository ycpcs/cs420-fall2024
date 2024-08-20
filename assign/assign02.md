---
layout: default
course_number: CS420
title: "Assignment 2: Interprocess Communication"
---


<br>

### About this Assignment

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

In this programming assignment you will learn about and use the following POSIX system calls: **`fork()`**, **`exec()`**, **`shmget()`**, **`shmat()`**, **`shmdt()`**, **`shmctl()`**.  If you do not use each of these system calls at least once, then you've probably done something wrong. You should also familiarize yourself with the **man pages** for each of these system calls. 

For example, to read about the shmget function, run the following command from your terminal:

	man shmget

Doing a **`man`** query via [Google](https://letmegooglethat.com/?q=man+shmget) will also produce the appropriate documentation.


Once again, you should be using a **POSIX-compliant environment**, such as Linux, to write your programs. 

For this assignment, you are permitted to use **`printf`** and other functions in the **POSIX API** for your I/O.


<br>

### Getting Started

 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

First download the [assignment](assign02_shared_memory.zip).  The assignment is distributed as a **CLion** project that includes multiple run configurations to simplify debugging. 



<br>

### Your Task

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Your task is to write two programs (**`mainProc`** and **`childProc`**) that communicate with each other through shared memory. The **`mainProc`** must request shared memory from the operating system and store data in that shared memory. The **`mainProc`**  must then fork off **`childProc`** which must read from and write data back into the shared memory. Finally, the **`mainProc`** must read and print the contents of the shared memory.


<br>

### Creating the mainProc program

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The **`mainProc`** program must accomplish the following:

 * parse command line arguments (described in more detail below)
 * request a segment of shared memory from the kernel
 * attach to the shared memory
 * write a value to the shared memory
 * fork a child processes
 * wait for child process to complete
 * print the contents of a shared memory buffer (written by the child process)
 * detach from the shared memory
 * destroy the segment of shared memory

 
<br>

#### <u>Parsing arguments</u>

Your **`mainProc`** program **MUST** take a single command line argument. The usage statement for **`mainProc`**, with an explanation of the command line arguments is below:

<pre>
usage: ./mainProc &lt;repeat_val&gt;
    &lt;repeat_val&gt; : the number of times the child processes is required
                   to write a string to a shared memory buffer
</pre>

Your **`mainProc`** program should accept the single command line argument as an integer.  This value will eventually get passed to a child process through shared memory. 


<br>

#### <u>Requesting, attaching to, and writing to shared memory</u>

Before creating the child process, the main process should use the **`shmget()`** system call to request a chunk of shared memory from the operating system. The amount of memory requested should be **`sizeof(struct ipc_struct)`**. The definition of the **`ipc_struct`** is included in the **`ipcEx.h`** header file. Note that the command line argument received by **`mainProc`** will eventually be passed to the child process by storing it in the **`repeat_val`** field of the **`ipc_struct`**.

After requesting the shared memory from the operating system, the main process should attach to the shared memory using the **`shmat()`** system call. As mentioned in class, the block of shared memory has no structure. To give the shared memory some structure (from the perspective of the main process), you can map an **`ipc_struct`** onto the shared memory as follows:

```c
/* cast the memory pointer returned by shmat as a (struct ipc_struct *),
 * then assign that to a variable defined as a (struct ipc_struct *) */
struct ipc_struct* shared_memory = (struct ipc_struct*) shmat( /* INSERT ARGS HERE */ );

/* access the members of the struct in typical C/C++ fashion */
shared_memory->repeat_val =  ...
```

Note that the above code **DOES NOT ALLOCATE ANY NEW MEMORY**. It simply attaches to and creates a pointer to the memory that was already allocated as shared memory by a call to **`shmget()`**.  The **`repeat_val`** can be written to shared memory as shown.


<br>

#### <u>Creating the child process</u>

Now that the shared memory has been created, your **`mainProc`** program should fork off a child process using the **`fork()`** system call. Remember, that when you fork off a child process, both the parent and the child process continue running code from the **`fork()`** call forward. To have the child process run your **`childProc`** program, you can use the **`execlp()`** system call to replace the memory contents of the child process. The  **`execlp()`** system call allows you to pass arguments to the program that you want to run. For this programming assignment, you will need to pass the **`segment_id`** as an argument to the child process so that the child process knows where to find the shared memory.


<br>

#### <u>Wait for the child process and printing shared memory buffer</u>

While the **`childProc`** is running, the parent process can simply wait for the child to complete using the **`wait`** system call. When the child exits, the parent must retrieve the string data that was written to the shared memory by the child process and print it to the terminal. You **MUST** be able to print the complete contents of shared memory using a single call to **`printf`**.  Read the following section for more details on what the **`childProc`** must write to the shared memory. 


<br>

#### <u>Detach from and destroy the shared memory</u>

Finally, the **`mainProc`** program should detach from the shared memory using the **`shmdt()`** system call and cleanup the shared memory using the **`shmctl()`** system call. 


<br>

### Creating the childProc program

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The **`childProc`** program must accomplish the following:

 * parse incoming arguments (described in more detail below)
 * attach to the already existing shared memory
 * read the **`repeat_val`** value from the shared memory
 * write a data string to a shared memory buffer **`repeat_val`** number of times
 * detach from the shared memory


<br>

#### <u>Parsing arguments</u>
 
Your **`childProc`** program should accept a single argument in **`argv[1]`** that represents the **`segment_id`** passed into **`childProc`** from **`mainProc`**.


<br>

#### <u>Attaching to and reading shared memory</u>
 

Your **`childProc`** program should request access to the shared memory using the **`shmat()`** system call. Just as in your main program, the child process should also map an **`ipc_struct`** to the shared memory. The **`childProc`** program can then access and utilize the **`repeat_val`** integer from the shared memory.  Note that there is no need to make a local copy, you can use **`repeat_val`** directly from the shared memory.


<br>

#### <u>Writing to the shared memory</u>

Replicate the provided **`data_string`** **`repeat_val`** number of times into the shared memory data buffer.  Lookup and use **`snprintf()`** for this.


<br>

#### <u>Detach from the shared memory</u>

Detach from the shared memory using the **`shmdt()`** system call and exit **`childProc`** .


<br>

### Running your Program

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

This assignment is distributed as a **CLion** project but also includes a standard **`Makefile`**.  Using **CLion** to develop and debug your assignment is recommended.  However, prior to submission verify that your assignment runs properly with the **`Makefile`** test described below.

The **CLion** project contains multiple preset run configurations.  The different configurations run **`mainProc`** with different parameters.

If preferred, you can use **`make`** from the terminal.  The **`Makefile`** provided contains a command that will compile and run your code. Your submission **MUST** run correctly when the following **`Makefile`** command is run, regardless of how you developed it:

<pre>
make runTest
</pre>

You can also run **`mainProc`** from the command line with different input arguments. Below is an example of running **`mainProc`** with a repeat value of 10.

<pre>
./mainProc 10
</pre>


<br>

### Sample Output

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Use print statements to output the progress of both programs. Each print statement should start with the either **`PARENT:`** or **`CHILD:`** to clearly indicate which process is printing the information. As an example, below is the output of my solution when run with an input argument of **`5`**. Yours should look very similar.

<pre>
> ./mainProc 5

PARENT: Created shared memory with a segment ID of 1048576
PARENT: The child process should store its string in shared
        memory a total of 5 times.

CHILD: Received 2 arguments
CHILD: Attempting to access segment ID 1048576...
CHILD: Parent requested that I store my data 5 times
CHILD: Done copying data, exiting.


PARENT: Child with PID=26233 complete
PARENT: Child left the following in the data buffer:
============= Buffer start =============
Hello Shared Memory!
Hello Shared Memory!
Hello Shared Memory!
Hello Shared Memory!
Hello Shared Memory!
============= Buffer end ===============

PARENT: Done
</pre>



<br>

### Grading

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

This assignment will be graded on a 100 point scale as follows: 

**mainProc:**
 - **5 points** : compiles correctly
 - **5 points** : correctly parses command line arguments
 - **5 points** : correctly creates a shared memory segment
 - **5 points** : correctly accesses a shared memory segment
 - **5 points** : correctly writes repeatVal to shared memory
 - **10 points** : correctly forks a child process
 - **5 points** : correctly passes args to childProc
 - **10 points** : correctly prints data stored in shared memory buffer
 - **5 points** : correctly detaches from shared memory
 - **5 points** : correctly destroys shared memory segment

**childProc:**
 - **5 points** : compiles correctly
 - **5 points** : correctly parses command line arguments
 - **5 points** : correctly accesses a shared memory segment
 - **5 points** : correctly retrieves repeatVal from shared memory
 - **5 points** : correctly writes data to shared memory
 - **10 points** : correctly writes shared mem WITHOUT using strlen and/or strcat in loop
 - **5 points** : correctly detaches from shared memory

You may lose points for writing bad code (e.g. not checking error conditions, not closing files when you're done with them).



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

