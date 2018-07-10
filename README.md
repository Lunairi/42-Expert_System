# 42-Expert_System
Expert System is a project where you implement a back-chain inference engine that will read a text file and provide the outcome. The input file contains lines of logic, than provides facts (denoted by =) and later wants us to query and provide the results for select values (denoted by ?).


Ex.
- A + B => C
- A => B
- =A
- ?A
- Results: True

# The conditions we have to fulfill
- "AND" conditions. For example, "If A and B and [...] then X"
- "OR" conditions. For example, "If C or D then Z"
- "XOR" conditions. For example, "If A xor E then V". Remember that this
means "exclusive OR". It is only true if one and only one of the operands is true.
- Negation. For example, "If A and not B then Y"
- Multiple rules can have the same fact as a conclusion
- "AND" in conclusions. For example, "If A then B and C"
- Parentheses in expressions. Interpreted in much the same way as an arithmetic
expression.


There were no language constraints so we used node.js to write the Expert System, and utilized express and ejs to create a simple visualizer for the logic flow. Visualizer requires you to host locally and pass ?file=<test case> to run visualizer.
  
  
  Collabortaion Members:
  - apuel https://github.com/apuel
  - Lunairi https://github.com/Lunairi
