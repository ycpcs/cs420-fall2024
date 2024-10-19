
var PREPOPULATE = false;

var courseInfo = {
    courseName: "CS420: Operating Systems",
    classDays: ["Mon", "Wed", "Fri"],


    // The following is true if final exam is on the LAST day of class;
    // false if final exam is during exam week."
    inClassFinalExam: true,
    // The following is for the college-scheduled final exam.
    // It is not used if final is on last day of class"
    finalExamDates: [
        new FinalExamDay("101", new Date("12/8/2021 12:45:00")),
        new FinalExamDay("102", new Date("12/10/2021 15:00:00"))
    ],


    classPeriods: [
        {
            topic: new Topic( "Introduction", "lectures/lecture1_introduction.pdf" ),
            reading: new Reading("OSC10 § 1.1 - 1.3")
        },
        {
            topic: new Topic( "OS Overview", "lectures/lecture2_os_overview.pdf" ),
            reading: new Reading("OSC10 § 1.4 - 1.11")
        },
        {
            topic: new Topic( "Operating System Services & System Calls", "lectures/lecture3_services_and_system_calls.pdf" ),
            reading: new Reading("OSC10 § 2.1 - 2.4"),
            assign: new Homework("Homework #1", "homework/Homework_Assignment_1.txt", 10)
        },
        {
            topic: new Topic( "Operating System Structure", "lectures/lecture4_operating_system_structure.pdf" ),
            reading: new Reading("OSC10 § 2.7 - 2.11"),
            assign: new Assignment("Assignment #1: filecopy", "assign/assign01.html", 7)
        },
        {
            topic: new Topic( "Processes", "lectures/lecture5_processes.pdf" ),
            reading: new Reading("OSC10 § 3.1 - 3.3")
        },
        {
            topic: new Topic( "Interprocess Communication", "lectures/lecture6_interprocess_communication.pdf" ),
            reading: new Reading("OSC10 § 3.4 - 3.7"),
            assign: new Homework("Homework #2", "homework/Homework_Assignment_2.txt", 4)
        },
        {
            topic: new Topic( "Interprocess Communication (continued)", "lectures/lecture7_client_server_communication.pdf" ),
            assign: new Assignment("Assignment #2: shared_memory", "assign/assign02.html", 16)
        },
        {
            topic: new Topic( "Threads", "lectures/lecture8_threads.pdf" ),
            reading: new Reading("OSC10 § 4.1 - 4.5"),
            assign: new Homework("Homework #3", "homework/Homework_Assignment_3.txt", 7)
        },
        {
            topic: new Topic( "Threading Libraries", "lectures/lecture8_threads.pdf" )
        },
        {
            topic: new Topic( "Threading Issues", "lectures/lecture9_threading_issues.pdf" ),
            reading: new Reading("OSC10 § 4.6 - 4.8")
        },
        {
            topic: new Topic( "CPU Scheduling", "lectures/lecture10+11_cpu_scheduling.pdf" ),
            reading: new Reading("OSC10 § 5.1 - 5.4"),
            assign: new Homework("Homework #4", "homework/Homework_Assignment_4.txt", 7)
        },
        {
            topic: new Topic( "CPU Scheduling (continued)", "lectures/lecture10+11_cpu_scheduling.pdf" ),
        },
        {
            topic: new Topic( "Multiple-Processor Scheduling", "lectures/lecture12_multiprocessor_scheduling.pdf" ),
            reading: new Reading("OSC10 § 5.5 - 5.9")
        },
        {
            topic: new Topic( "Review for Exam #1", "" ),
        },
        {
            topic: new Topic( "** Exam #1", "" ),
        },
        {
            topic: new Topic( "Process Synchronization", "lectures/lecture13+14_process_synchronization.pdf" ),
            reading: new Reading("OSC10 § 6.1 - 6.6")
        },
        {
            topic: new Topic( "Semaphores", "lectures/lecture13+14_process_synchronization.pdf" ),
            reading: new Reading("OSC10 § 6.1 - 6.6")
        },
        {
            topic: new Topic( "Classic Problems of Synchronization", "lectures/lecture15_classic_synchronization_problems.pdf" ),
            reading: new Reading("OSC10 § 6.7 - 6.10, 7.1"),
            assign: new Assignment("Assignment #3: semaphores", "assign/assign03.html", 25)            
        },
        {
            topic: new Topic( "More on Semaphores and Synchronization", "" )
            // 2024 - moved due tp surgery
//            assign: new Assignment("Assignment #3: semaphores", "assign/assign03.html", 23)
        },
        {
            topic: new Topic( "Deadlocks & Deadlock Prevention", "lectures/lecture16+17+18_deadlock.pdf" ),
            reading: new Reading("OSC10 § 8.1 - 8.5")
        },
        {
            topic: new Topic( "Deadlock Avoidance", "lectures/lecture16+17+18_deadlock.pdf" ),
            reading: new Reading("OSC10 § 8.6"),
            assign: new Homework("Homework #5", "homework/Homework_Assignment_5.txt", 7)
        },
        {
            topic: new Topic( "Deadlock Detection, and Recovery", "lectures/lecture16+17+18_deadlock.pdf" ),
            reading: new Reading("OSC10 § 8.7 - 8.9")
        },
        {
            topic: new Topic( "Main Memory - Swapping and Allocation", "lectures/lecture19_main_memory.pdf" ),
            reading: new Reading("OSC10 § 9.1 - 9.2")
        },
        {
            topic: new Topic( "Paging & Paging Tables", "lectures/lecture20_paging_and_page_tables.pdf" ),
            reading: new Reading("OSC10 § 9.3 - 9.5"),
            assign: new Homework("Homework #6", "homework/Homework_Assignment_6.txt", 5)
        },
        {
            topic: new Topic( "Virtual Memory", "lectures/lecture21+22+23_virtual_memory.pdf" ),
            reading: new Reading("OSC10 § 10.2 - 10.6")
        },
        {
            topic: new Topic( "Virtual Memory (continued)", "lectures/lecture21+22+23_virtual_memory.pdf" ),
            assign: new Homework("Homework #7", "homework/Homework_Assignment_7.txt", 4)
        },
        {
            topic: new Topic( "Virtual Memory (continued)", "lectures/lecture21+22+23_virtual_memory.pdf" ),
        },
        {
            topic: new Topic( "Review for Exam #2", "" ),
        },
        {
            topic: new Topic( "** Exam #2", "" ),
        },
        {
            topic: new Topic( "Mass Storage Structure", "lectures/lecture24_mass_storage_structure.pdf" ),
            reading: new Reading("OSC10 § 11.1 - 11.7"),
            assign: new Homework("Homework #8", "homework/Homework_Assignment_8.txt", 7)
        },
        {
            topic: new Topic( "RAID Structure", "lectures/lecture25_RAID.pdf" ),
            reading: new Reading("OSC10 § 11.8 - 11.9")
        },
        {
            topic: new Topic( "File System Interface", "lectures/lecture27_file_system_interface.pdf" ),
            reading: new Reading("OSC10 § 13.1 - 13.6")
        },
        {
            topic: new Topic( "File-System Implementation", "lectures/lecture28+29_file_system_implementation.pdf" ),
            reading: new Reading("OSC10 § 14.1 - 14.9"),
            assign: new Homework("Homework #9", "homework/Homework_Assignment_9.txt", 7)            
        },
        {
            topic: new Topic( "File-System Implementation (continued)", "lectures/lecture28+29_file_system_implementation.pdf" ),
        },
        {
            topic: new Topic( "IO Systems", "lectures/lecture26_io_systems.pdf" ),
            reading: new Reading("OSC10 § 12.1 - 12.3")
        },
        {
            topic: new Topic( "Security Issues - Trojan Horses, Viruses, etc.", "lectures/lecture30+31+32+33_security_issues.pdf" ),
            reading: new Reading("OSC10 § 16.1 - 16.3")
        },
        {
            topic: new Topic( "Security Issues (continued)", "lectures/lecture30+31+32+33_security_issues.pdf" ),
        },
        {
            topic: new Topic( "Security Issues (continued)", "lectures/lecture30+31+32+33_security_issues.pdf" ),
        },
        {
            topic: new Topic( "Security Issues (continued)", "lectures/lecture30+31+32+33_security_issues.pdf" ),
        },
        {
            topic: new Topic( "Cryptography", "lectures/lecture34_cryptography.pdf" ),
        },
        {
            topic: new Topic( "Review for Final Exam", "" ),
        },
        {
            topic: new Topic( "** Final Exam (cumulative)", "" )
        }
    ]
};
