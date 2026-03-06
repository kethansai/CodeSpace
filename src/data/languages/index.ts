import type { Language } from "@/data/types";

export const languages: Language[] = [
  {
    id: "javascript",
    slug: "javascript",
    name: "JavaScript",
    icon: "🟨",
    color: "bg-yellow-500",
    description:
      "The language of the web. Essential for frontend development and increasingly used in backend with Node.js.",
    topics: [
      {
        id: "js-variables",
        slug: "variables",
        title: "Variables & Data Types",
        description:
          "Understanding var, let, const, and JavaScript data types.",
        order: 1,
        keyTakeaways: [
          "Use const by default, let when reassignment is needed",
          "JavaScript has 7 primitive types + Object",
          "typeof operator for type checking",
        ],
        content: `## Variables in JavaScript

JavaScript provides three ways to declare variables: \`var\`, \`let\`, and \`const\`.

### var (Legacy)
- Function-scoped (not block-scoped)
- Can be redeclared and reassigned
- Hoisted to the top of its scope

### let (Modern)
- Block-scoped (respects \`{}\`)
- Can be reassigned but not redeclared
- Not hoisted (temporal dead zone)

### const (Modern)
- Block-scoped
- Cannot be reassigned or redeclared
- Objects/arrays declared with \`const\` can still be mutated

### Data Types
JavaScript has **7 primitive types** and **1 structural type**:

| Type | Example | typeof |
|------|---------|--------|
| String | \`"hello"\` | \`"string"\` |
| Number | \`42\`, \`3.14\` | \`"number"\` |
| BigInt | \`9007199254740991n\` | \`"bigint"\` |
| Boolean | \`true\`, \`false\` | \`"boolean"\` |
| undefined | \`undefined\` | \`"undefined"\` |
| null | \`null\` | \`"object"\` ⚠️ |
| Symbol | \`Symbol('id')\` | \`"symbol"\` |
| Object | \`{}\`, \`[]\`, \`function(){}\` | \`"object"\` |

> **Key Insight:** JavaScript is *dynamically typed* — variables can hold any type and change types at runtime.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Variable declarations
const name = "codespace";    // String (immutable binding)
let count = 0;               // Number (can reassign)
var legacy = true;           // Boolean (function-scoped, avoid)

// Data types
const str = "Hello";         // string
const num = 42;              // number
const big = 9007199254740991n; // bigint
const bool = true;           // boolean
const undef = undefined;     // undefined
const nul = null;            // null (typeof = "object" — JS quirk!)
const sym = Symbol("id");    // symbol
const obj = { key: "value" };// object

// typeof operator
console.log(typeof str);     // "string"
console.log(typeof num);     // "number"
console.log(typeof bool);    // "boolean"
console.log(typeof obj);     // "object"
console.log(typeof nul);     // "object" (historical bug)

// Block scoping difference
{
  let blockScoped = "visible here";
  var functionScoped = "visible everywhere";
}
// console.log(blockScoped);   // ReferenceError!
console.log(functionScoped);   // "visible everywhere"`,
          },
          {
            language: "python",
            label: "Python Equivalent",
            code: `# Python variables (dynamically typed, no declaration keyword)
name = "codespace"    # str
count = 0             # int
is_active = True      # bool

# Data types
text = "Hello"        # str
integer = 42          # int
floating = 3.14       # float
boolean = True        # bool
none_val = None       # NoneType
lst = [1, 2, 3]      # list
dct = {"key": "val"}  # dict

# type() function
print(type(text))     # <class 'str'>
print(type(integer))  # <class 'int'>
print(type(none_val)) # <class 'NoneType'>`,
          },
        ],
      },
      {
        id: "js-functions",
        slug: "functions",
        title: "Functions & Scope",
        description:
          "Function declarations, expressions, arrow functions, and scope chain.",
        order: 2,
        keyTakeaways: [
          "Arrow functions do not have their own this",
          "Functions are first-class objects",
          "Scope chain determines variable access",
        ],
        content: `## Functions in JavaScript

Functions are first-class citizens in JavaScript — they can be assigned to variables, passed as arguments, and returned from other functions.

### Function Declaration
- Hoisted: can be called before the declaration
- Has its own \`this\` binding

### Function Expression
- Not hoisted: only available after assignment
- Can be anonymous or named

### Arrow Functions (ES6+)
- Shorter syntax
- **No own \`this\`** — inherits from enclosing scope (lexical \`this\`)
- No \`arguments\` object
- Cannot be used as constructors

### Scope
JavaScript uses **lexical scoping** (static scoping). Inner functions have access to variables in outer scopes.

\`\`\`
Global Scope
  └── Function Scope (outer)
        └── Block Scope (if/for)
              └── Nested Function Scope (inner)
\`\`\``,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// 1. Function Declaration (hoisted)
function greet(name) {
  return \`Hello, \${name}!\`;
}

// 2. Function Expression (not hoisted)
const add = function(a, b) {
  return a + b;
};

// 3. Arrow Function (ES6+)
const multiply = (a, b) => a * b;

// 4. Higher-order function
function applyOperation(a, b, operation) {
  return operation(a, b);
}

console.log(applyOperation(5, 3, add));       // 8
console.log(applyOperation(5, 3, multiply));  // 15

// 5. Scope chain
const globalVar = "global";

function outer() {
  const outerVar = "outer";

  function inner() {
    const innerVar = "inner";
    console.log(globalVar); // ✅ "global"
    console.log(outerVar);  // ✅ "outer"
    console.log(innerVar);  // ✅ "inner"
  }

  inner();
  // console.log(innerVar); // ❌ ReferenceError
}

outer();

// 6. Arrow function vs regular (this binding)
const obj = {
  name: "codespace",
  regular: function() { return this.name; },
  arrow: () => { return this.name; }, // 'this' is NOT obj
};

console.log(obj.regular()); // "codespace"
console.log(obj.arrow());   // undefined (or global)`,
          },
          {
            language: "python",
            label: "Python Equivalent",
            code: `# Regular function
def greet(name):
    return f"Hello, {name}!"

# Lambda (anonymous)
add = lambda a, b: a + b
multiply = lambda a, b: a * b

# Higher-order function
def apply_operation(a, b, operation):
    return operation(a, b)

print(apply_operation(5, 3, add))       # 8
print(apply_operation(5, 3, multiply))  # 15

# Scope: LEGB rule (Local, Enclosing, Global, Built-in)
global_var = "global"

def outer():
    outer_var = "outer"

    def inner():
        inner_var = "inner"
        print(global_var)  # ✅
        print(outer_var)   # ✅
        print(inner_var)   # ✅

    inner()

outer()`,
          },
        ],
      },
      {
        id: "js-closures",
        slug: "closures",
        title: "Closures",
        description:
          "Understanding closures — functions that remember their lexical environment.",
        order: 3,
        keyTakeaways: [
          "A closure is a function + its lexical environment",
          "Used for data privacy and state preservation",
          "Common in callbacks, event handlers, and module patterns",
        ],
        content: `## Closures

A **closure** is created when a function retains access to its lexical scope even after the outer function has returned.

### How Closures Work
1. A function is defined inside another function
2. The inner function references variables from the outer function
3. The outer function returns the inner function (or passes it somewhere)
4. The inner function still has access to the outer function's variables

### Common Use Cases
- **Data Privacy:** Creating private variables
- **Function Factories:** Generating specialized functions
- **Callbacks & Event Handlers:** Preserving state
- **Module Pattern:** Encapsulating implementation details

### Memory Consideration
Closures keep the referenced outer variables alive in memory. Be mindful of unintentional closures in loops.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Basic closure
function createCounter() {
  let count = 0; // Private variable - enclosed!

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
// console.log(count);            // ❌ Not accessible!

// Function factory using closures
function createMultiplier(factor) {
  return (number) => number * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Classic closure pitfall (loop + var)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3 ❌
}

// Fix with let (block scope creates new closure per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2 ✅
}`,
          },
          {
            language: "python",
            label: "Python Equivalent",
            code: `# Closure in Python
def create_counter():
    count = 0  # Enclosed variable

    def increment():
        nonlocal count
        count += 1
        return count

    def get_count():
        return count

    return increment, get_count

inc, get = create_counter()
print(inc())    # 1
print(inc())    # 2
print(get())    # 2

# Function factory
def create_multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

double = create_multiplier(2)
triple = create_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15`,
          },
        ],
      },
      {
        id: "js-promises",
        slug: "promises",
        title: "Promises & Async Patterns",
        description:
          "Handling asynchronous operations with Promises, async/await, and error handling.",
        order: 4,
        keyTakeaways: [
          "Promises represent eventual completion/failure of async operations",
          "async/await is syntactic sugar over Promises",
          "Always handle errors with try/catch or .catch()",
        ],
        content: `## Promises & Async/Await

JavaScript is **single-threaded** but handles asynchronous operations through an event-driven model. Promises provide a cleaner way to handle async operations compared to callbacks.

### Promise States
1. **Pending** — Initial state, operation in progress
2. **Fulfilled** — Operation completed successfully
3. **Rejected** — Operation failed

### Promise Chaining
Multiple \`.then()\` calls create a chain where each step receives the result of the previous one.

### async/await
Syntactic sugar over Promises that makes async code look synchronous, improving readability.

### Error Handling
- \`.catch()\` for Promise chains
- \`try/catch\` for async/await`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Creating a Promise
function fetchData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url) {
        resolve({ data: "Success!", url });
      } else {
        reject(new Error("URL is required"));
      }
    }, 1000);
  });
}

// Promise chaining
fetchData("https://api.example.com")
  .then(result => {
    console.log(result.data); // "Success!"
    return result.url;
  })
  .then(url => console.log("URL:", url))
  .catch(err => console.error(err.message));

// async/await (cleaner syntax)
async function getData() {
  try {
    const result = await fetchData("https://api.example.com");
    console.log(result.data); // "Success!"
  } catch (err) {
    console.error(err.message);
  }
}

// Promise.all — parallel execution
async function fetchMultiple() {
  const [users, posts] = await Promise.all([
    fetchData("/users"),
    fetchData("/posts"),
  ]);
  console.log(users, posts);
}

// Promise.race — first to resolve/reject wins
const fastest = await Promise.race([
  fetchData("/fast"),
  new Promise((_, reject) =>
    setTimeout(() => reject("Timeout!"), 5000)
  ),
]);`,
          },
          {
            language: "python",
            label: "Python (asyncio)",
            code: `import asyncio

# Async function
async def fetch_data(url):
    await asyncio.sleep(1)  # Simulate async I/O
    if url:
        return {"data": "Success!", "url": url}
    raise ValueError("URL is required")

# Using async/await
async def get_data():
    try:
        result = await fetch_data("https://api.example.com")
        print(result["data"])  # "Success!"
    except ValueError as err:
        print(f"Error: {err}")

# Parallel execution
async def fetch_multiple():
    users, posts = await asyncio.gather(
        fetch_data("/users"),
        fetch_data("/posts"),
    )
    print(users, posts)

asyncio.run(get_data())`,
          },
        ],
      },
      {
        id: "js-event-loop",
        slug: "event-loop",
        title: "Event Loop & Concurrency",
        description:
          "How JavaScript handles concurrency with the event loop, call stack, and task queues.",
        order: 5,
        keyTakeaways: [
          "JavaScript is single-threaded with an event loop",
          "Microtasks (Promises) run before macrotasks (setTimeout)",
          "Understanding the event loop is crucial for debugging async code",
        ],
        content: `## The Event Loop

JavaScript runs on a **single thread** but achieves concurrency through the **event loop** mechanism.

### Components
1. **Call Stack** — Executes function calls (LIFO)
2. **Web APIs / Node APIs** — Handle async operations (timers, HTTP, DOM events)
3. **Callback Queue (Macrotask Queue)** — setTimeout, setInterval, I/O callbacks
4. **Microtask Queue** — Promise callbacks, queueMicrotask, MutationObserver

### Execution Order
1. Execute all synchronous code (call stack)
2. Process **all microtasks** (Promise.then, async/await continuations)
3. Process **one macrotask** (setTimeout callback)
4. Repeat from step 2

> **Key Rule:** Microtasks always run before the next macrotask.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Event loop demonstration
console.log("1. Synchronous - first");

setTimeout(() => {
  console.log("4. Macrotask - setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask - Promise.then");
});

console.log("2. Synchronous - second");

// Output order:
// 1. Synchronous - first
// 2. Synchronous - second
// 3. Microtask - Promise.then
// 4. Macrotask - setTimeout

// Nested microtasks run before macrotasks
setTimeout(() => console.log("Macro 1"), 0);
Promise.resolve()
  .then(() => {
    console.log("Micro 1");
    return Promise.resolve();
  })
  .then(() => console.log("Micro 2"));
setTimeout(() => console.log("Macro 2"), 0);

// Output: Micro 1, Micro 2, Macro 1, Macro 2`,
          },
        ],
      },
      {
        id: "js-prototypes",
        slug: "prototypes",
        title: "Prototypes & Inheritance",
        description:
          "JavaScript's prototype chain, classes, and inheritance patterns.",
        order: 6,
        keyTakeaways: [
          "Everything in JS inherits from Object.prototype",
          "ES6 classes are syntactic sugar over prototypes",
          "Prototype chain is used for property lookup",
        ],
        content: `## Prototypes & Inheritance

JavaScript uses **prototypal inheritance** rather than classical inheritance. Every object has a hidden \`[[Prototype]]\` link.

### Prototype Chain
When you access a property on an object, JavaScript:
1. Checks the object itself
2. Checks the object's prototype  
3. Checks the prototype's prototype
4. Continues until \`null\` is reached

### ES6 Classes
Classes in JavaScript are syntactic sugar over the prototype system. They provide a cleaner syntax but work the same way under the hood.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// ES6 Class syntax
class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }

  speak() {
    return \`\${this.name} says \${this.sound}\`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, "Woof!");
  }

  fetch(item) {
    return \`\${this.name} fetches \${item}\`;
  }
}

const dog = new Dog("Rex");
console.log(dog.speak());     // "Rex says Woof!"
console.log(dog.fetch("ball")); // "Rex fetches ball"

// Prototype chain verification
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
console.log(dog instanceof Object); // true

// Under the hood — prototype chain:
// dog → Dog.prototype → Animal.prototype → Object.prototype → null`,
          },
        ],
      },
    ],
  },
  {
    id: "python",
    slug: "python",
    name: "Python",
    icon: "🐍",
    color: "bg-blue-500",
    description:
      "A versatile, readable language perfect for backend development, data science, and automation.",
    topics: [
      {
        id: "py-basics",
        slug: "basics",
        title: "Python Basics",
        description:
          "Variables, data types, operators, and control flow in Python.",
        order: 1,
        keyTakeaways: [
          "Python uses indentation for blocks",
          "Dynamically typed but strongly typed",
          "Everything is an object in Python",
        ],
        content: `## Python Basics

Python is known for its clean syntax and readability. It uses **indentation** to define code blocks instead of braces.

### Key Features
- **Dynamically typed**: No need to declare types
- **Strongly typed**: No implicit type coercion (unlike JavaScript)
- **Interpreted**: Runs line by line
- **Multi-paradigm**: Supports OOP, functional, and procedural styles

### Data Types
| Type | Example | Mutable? |
|------|---------|----------|
| int | \`42\` | No |
| float | \`3.14\` | No |
| str | \`"hello"\` | No |
| bool | \`True\` | No |
| list | \`[1, 2, 3]\` | Yes |
| tuple | \`(1, 2, 3)\` | No |
| dict | \`{"a": 1}\` | Yes |
| set | \`{1, 2, 3}\` | Yes |`,
        codeExamples: [
          {
            language: "python",
            label: "Python",
            code: `# Variables (no declaration keyword needed)
name = "codespace"       # str
count = 42               # int
price = 9.99             # float
is_active = True         # bool
items = [1, 2, 3]        # list (mutable)
coords = (10, 20)        # tuple (immutable)
settings = {"theme": "dark"}  # dict
unique = {1, 2, 3}       # set

# Type checking
print(type(name))        # <class 'str'>
print(isinstance(count, int))  # True

# String formatting (f-strings — Python 3.6+)
print(f"Welcome to {name}! Count: {count}")

# Control flow
if count > 10:
    print("Large")
elif count > 0:
    print("Small")
else:
    print("Zero or negative")

# Loops
for item in items:
    print(item)

# List comprehension
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Functions
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}!"

print(greet("World"))          # "Hello, World!"
print(greet("World", "Hi"))    # "Hi, World!"`,
          },
          {
            language: "javascript",
            label: "JavaScript Equivalent",
            code: `// Variables
const name = "codespace";
let count = 42;
const price = 9.99;
const isActive = true;
const items = [1, 2, 3];
const settings = { theme: "dark" };

// Type checking
console.log(typeof name);  // "string"

// Template literals
console.log(\`Welcome to \${name}! Count: \${count}\`);

// Control flow
if (count > 10) {
    console.log("Large");
} else if (count > 0) {
    console.log("Small");
} else {
    console.log("Zero or negative");
}

// Array methods
const squares = Array.from({length: 10}, (_, x) => x ** 2);
console.log(squares);

// Functions
function greet(name, greeting = "Hello") {
    return \`\${greeting}, \${name}!\`;
}`,
          },
        ],
      },
      {
        id: "py-data-structures",
        slug: "data-structures",
        title: "Python Data Structures",
        description: "Lists, tuples, dictionaries, sets, and their operations.",
        order: 2,
        keyTakeaways: [
          "Lists are versatile and most commonly used",
          "Dicts have O(1) average lookup time",
          "Sets are great for uniqueness and set operations",
        ],
        content: `## Python Built-in Data Structures

Python provides powerful built-in data structures that cover most use cases without external libraries.

### Lists
- Ordered, mutable, allows duplicates
- Dynamic arrays under the hood
- O(1) append, O(n) insert/delete at beginning

### Dictionaries
- Key-value pairs, mutable, ordered (Python 3.7+)
- Hash table implementation
- O(1) average for get/set/delete

### Sets
- Unordered, mutable, no duplicates
- Hash table implementation
- O(1) average for add/remove/lookup

### Tuples
- Ordered, immutable
- Used for fixed collections, as dict keys, and function returns`,
        codeExamples: [
          {
            language: "python",
            label: "Python",
            code: `# Lists — ordered, mutable
fruits = ["apple", "banana", "cherry"]
fruits.append("date")         # Add to end
fruits.insert(1, "avocado")   # Insert at index
fruits.remove("banana")       # Remove by value
popped = fruits.pop()         # Remove & return last
print(fruits)                 # ['apple', 'avocado', 'cherry']

# List slicing
nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(nums[2:5])    # [2, 3, 4]
print(nums[:3])     # [0, 1, 2]
print(nums[::2])    # [0, 2, 4, 6, 8] (every 2nd)
print(nums[::-1])   # [9, 8, 7, ...] (reversed)

# Dictionaries — key-value pairs
user = {
    "name": "Alice",
    "age": 30,
    "skills": ["Python", "JavaScript"]
}
user["email"] = "alice@example.com"  # Add key
age = user.get("age", 0)  # Safe get with default
del user["age"]            # Delete key

# Dict comprehension
squares = {x: x**2 for x in range(6)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Sets — unique elements
colors = {"red", "green", "blue"}
colors.add("yellow")
colors.discard("red")

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)    # Union: {1, 2, 3, 4, 5, 6}
print(a & b)    # Intersection: {3, 4}
print(a - b)    # Difference: {1, 2}`,
          },
        ],
      },
      {
        id: "py-oop",
        slug: "oop",
        title: "Object-Oriented Programming",
        description:
          "Classes, inheritance, encapsulation, and polymorphism in Python.",
        order: 3,
        keyTakeaways: [
          "Python supports multiple inheritance",
          "Use @property for getters/setters",
          "Dunder methods customize object behavior",
        ],
        content: `## OOP in Python

Python is a multi-paradigm language with full support for Object-Oriented Programming.

### Key Concepts
- **Class**: Blueprint for creating objects
- **Instance**: An object created from a class
- **Inheritance**: Child class inherits from parent  
- **Encapsulation**: Bundling data + methods, controlling access
- **Polymorphism**: Same interface, different implementations`,
        codeExamples: [
          {
            language: "python",
            label: "Python",
            code: `class Animal:
    def __init__(self, name: str, sound: str):
        self.name = name
        self._sound = sound  # Protected by convention

    @property
    def sound(self):
        return self._sound

    def speak(self) -> str:
        return f"{self.name} says {self._sound}"

    def __str__(self) -> str:
        return f"Animal({self.name})"

    def __repr__(self) -> str:
        return f"Animal(name={self.name!r}, sound={self._sound!r})"


class Dog(Animal):
    def __init__(self, name: str):
        super().__init__(name, "Woof!")

    def fetch(self, item: str) -> str:
        return f"{self.name} fetches {item}"


class Cat(Animal):
    def __init__(self, name: str):
        super().__init__(name, "Meow!")

    def purr(self) -> str:
        return f"{self.name} purrs..."


# Usage
dog = Dog("Rex")
cat = Cat("Whiskers")

print(dog.speak())      # "Rex says Woof!"
print(cat.speak())      # "Whiskers says Meow!"
print(dog.fetch("ball"))# "Rex fetches ball"

# Polymorphism
animals = [dog, cat]
for animal in animals:
    print(animal.speak())  # Same method, different behavior

# isinstance check
print(isinstance(dog, Animal))  # True
print(isinstance(dog, Dog))     # True`,
          },
        ],
      },
      {
        id: "py-decorators",
        slug: "decorators",
        title: "Decorators",
        description:
          "Understanding decorators — functions that modify other functions.",
        order: 4,
        keyTakeaways: [
          "Decorators are functions that wrap other functions",
          "@decorator syntax is syntactic sugar",
          "Used for logging, caching, authentication, etc.",
        ],
        content: `## Python Decorators

A **decorator** is a function that takes another function as input and returns a modified version of it. They leverage closures and first-class functions.

### How Decorators Work
\`@decorator\` is syntactic sugar for \`func = decorator(func)\`

### Common Built-in Decorators
- \`@property\` — getters/setters
- \`@staticmethod\` — no self parameter
- \`@classmethod\` — receives class as first arg
- \`@functools.lru_cache\` — memoization`,
        codeExamples: [
          {
            language: "python",
            label: "Python",
            code: `import functools
import time

# Basic decorator
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(0.1)
    return "Done!"

result = slow_function()  # "slow_function took 0.100Xs"

# Decorator with arguments
def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hello(name):
    print(f"Hello, {name}!")

say_hello("World")  # Prints 3 times

# Memoization with @lru_cache
@functools.lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(50))  # Instant! Cached results`,
          },
        ],
      },
      {
        id: "py-generators",
        slug: "generators",
        title: "Generators & Iterators",
        description:
          "Lazy evaluation with generators and the iterator protocol.",
        order: 5,
        keyTakeaways: [
          "Generators produce values lazily (on-demand)",
          "Use yield instead of return",
          "Memory efficient for large datasets",
        ],
        content: `## Generators

Generators are functions that produce a sequence of values **lazily** — one at a time, only when requested. They use the \`yield\` keyword.

### Benefits
- **Memory efficient**: Don't store entire sequence in memory
- **Lazy evaluation**: Values computed on-demand
- **Pipeline composition**: Chain generators together`,
        codeExamples: [
          {
            language: "python",
            label: "Python",
            code: `# Generator function
def fibonacci_gen(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

# Use generator
for num in fibonacci_gen(100):
    print(num, end=" ")
# 0 1 1 2 3 5 8 13 21 34 55 89

# Generator expression (like list comprehension but lazy)
squares = (x**2 for x in range(1000000))
print(next(squares))  # 0
print(next(squares))  # 1
# Memory: only stores one value at a time!

# Pipeline - chaining generators
def read_lines(data):
    for line in data:
        yield line.strip()

def filter_non_empty(lines):
    for line in lines:
        if line:
            yield line

def to_upper(lines):
    for line in lines:
        yield line.upper()

data = ["  hello  ", "", "  world  ", "  ", "  python  "]
pipeline = to_upper(filter_non_empty(read_lines(data)))
print(list(pipeline))  # ['HELLO', 'WORLD', 'PYTHON']`,
          },
        ],
      },
    ],
  },
  {
    id: "typescript",
    slug: "typescript",
    name: "TypeScript",
    icon: "🔷",
    color: "bg-blue-600",
    description:
      "JavaScript with static typing. The industry standard for large-scale JavaScript applications.",
    topics: [
      {
        id: "ts-basics",
        slug: "basics",
        title: "TypeScript Fundamentals",
        description:
          "Type annotations, interfaces, generics, and TypeScript's type system.",
        order: 1,
        keyTakeaways: [
          "TypeScript adds static types to JavaScript",
          "Interfaces define object shapes",
          "Generics provide reusable type-safe components",
        ],
        content: `## TypeScript Fundamentals

TypeScript is a **typed superset of JavaScript** that compiles to plain JavaScript. It adds optional static typing, interfaces, generics, and other features.

### Why TypeScript?
- Catch errors at **compile time** (not runtime)
- Better IDE support (autocompletion, refactoring)
- Self-documenting code via types
- Required for large codebases and teams`,
        codeExamples: [
          {
            language: "typescript",
            label: "TypeScript",
            code: `// Type annotations
let name: string = "codespace";
let count: number = 42;
let isActive: boolean = true;
let items: string[] = ["a", "b", "c"];

// Interface — defines object shape
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";  // Union type
  bio?: string;  // Optional
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "admin",
};

// Generics — reusable with any type
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = getFirst([1, 2, 3]);       // type: number
const firstStr = getFirst(["a", "b", "c"]); // type: string

// Type narrowing
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();  // TypeScript knows it's string
  }
  return value.toFixed(2);  // TypeScript knows it's number
}

// Utility types
type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
type UserWithoutBio = Omit<User, "bio">;
type UserKeys = keyof User; // "id" | "name" | "email" | "role" | "bio"`,
          },
        ],
      },
    ],
  },
  {
    id: "java",
    slug: "java",
    name: "Java",
    icon: "☕",
    color: "bg-red-500",
    description:
      "A strongly-typed, object-oriented language widely used in enterprise applications and Android development.",
    topics: [
      {
        id: "java-basics",
        slug: "basics",
        title: "Java Fundamentals",
        description: "Classes, data types, OOP, and the JVM.",
        order: 1,
        keyTakeaways: [
          "Everything in Java is inside a class",
          "Strongly typed with static type checking",
          "Runs on JVM — write once, run anywhere",
        ],
        content: `## Java Fundamentals

Java is a **statically-typed, object-oriented** language that runs on the Java Virtual Machine (JVM).

### Key Characteristics
- **Strongly typed**: Every variable has a declared type
- **Object-oriented**: Everything is a class (except primitives)
- **Platform independent**: Compiled to bytecode, runs on JVM
- **Garbage collected**: Automatic memory management`,
        codeExamples: [
          {
            language: "java",
            label: "Java",
            code: `// Java fundamentals
public class Main {
    public static void main(String[] args) {
        // Primitive types
        int count = 42;
        double price = 9.99;
        boolean isActive = true;
        char grade = 'A';

        // Reference types
        String name = "codespace";
        int[] numbers = {1, 2, 3, 4, 5};

        // String formatting
        System.out.printf("Welcome to %s! Count: %d%n", name, count);

        // Control flow
        if (count > 10) {
            System.out.println("Large");
        } else {
            System.out.println("Small");
        }

        // Enhanced for loop
        for (int num : numbers) {
            System.out.print(num + " ");
        }

        // ArrayList (dynamic array)
        var fruits = new java.util.ArrayList<String>();
        fruits.add("Apple");
        fruits.add("Banana");

        // HashMap
        var map = new java.util.HashMap<String, Integer>();
        map.put("Java", 1995);
        map.put("Python", 1991);
        System.out.println(map.get("Java")); // 1995
    }
}`,
          },
        ],
      },
    ],
  },
  {
    id: "csharp",
    slug: "csharp",
    name: "C#",
    icon: "#️⃣",
    color: "bg-violet-500",
    description:
      "A modern, object-oriented language by Microsoft. The backbone of .NET development.",
    topics: [
      {
        id: "cs-basics",
        slug: "basics",
        title: "C# Basics",
        description: "Types, classes, LINQ, and the .NET ecosystem.",
        order: 1,
        keyTakeaways: [
          "C# runs on .NET (cross-platform)",
          "Strongly typed with type inference (var)",
          "LINQ provides powerful data querying",
        ],
        content: `## C# Basics

C# is a modern, strongly-typed language developed by Microsoft. It runs on the **.NET** platform.

### Key Features
- **Strongly typed** with type inference (\`var\`)
- **Object-oriented** with modern features (records, pattern matching)
- **LINQ** — Language Integrated Query for data
- **Async/Await** — first-class async support
- **Cross-platform** — runs on Windows, macOS, Linux via .NET`,
        codeExamples: [
          {
            language: "csharp",
            label: "C#",
            code: `using System;
using System.Collections.Generic;
using System.Linq;

// Top-level statements (C# 10+)
var name = "codespace";
var count = 42;
var isActive = true;

Console.WriteLine($"Welcome to {name}! Count: {count}");

// Collections
var fruits = new List<string> { "Apple", "Banana", "Cherry" };
fruits.Add("Date");

// Dictionary
var map = new Dictionary<string, int>
{
    ["C#"] = 2000,
    ["Python"] = 1991,
    ["JavaScript"] = 1995
};

// LINQ — powerful querying
var recentLangs = map
    .Where(kv => kv.Value >= 1995)
    .OrderBy(kv => kv.Value)
    .Select(kv => $"{kv.Key} ({kv.Value})");

foreach (var lang in recentLangs)
    Console.WriteLine(lang);

// Records (immutable data classes)
record User(string Name, string Email, int Age);

var user = new User("Alice", "alice@example.com", 30);
var updated = user with { Age = 31 }; // Immutable copy

// Pattern matching
object value = 42;
var result = value switch
{
    int n when n > 0 => "Positive",
    int n when n < 0 => "Negative",
    0 => "Zero",
    _ => "Unknown"
};`,
          },
        ],
      },
    ],
  },
  {
    id: "cpp",
    slug: "cpp",
    name: "C++",
    icon: "⚡",
    color: "bg-sky-500",
    description:
      "A high-performance systems language. Essential for competitive programming and systems development.",
    topics: [
      {
        id: "cpp-basics",
        slug: "basics",
        title: "C++ Fundamentals",
        description: "Syntax, STL containers, pointers, and memory management.",
        order: 1,
        keyTakeaways: [
          "C++ gives direct memory control",
          "STL provides powerful containers and algorithms",
          "Smart pointers prevent memory leaks",
        ],
        content: `## C++ Fundamentals

C++ is a **statically-typed**, compiled language known for its performance and low-level control. It's widely used in systems programming, game development, and competitive programming.`,
        codeExamples: [
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
#include <string>
using namespace std;

int main() {
    // Variables
    string name = "codespace";
    int count = 42;
    double price = 9.99;
    bool isActive = true;

    cout << "Welcome to " << name << "!" << endl;

    // Vector (dynamic array)
    vector<int> nums = {5, 2, 8, 1, 9, 3};

    // Sort
    sort(nums.begin(), nums.end());
    // nums: {1, 2, 3, 5, 8, 9}

    // Map (hash map)
    map<string, int> languages;
    languages["C++"] = 1985;
    languages["Python"] = 1991;

    for (auto& [lang, year] : languages) {
        cout << lang << ": " << year << endl;
    }

    // Range-based for loop
    for (int n : nums) {
        cout << n << " ";
    }

    // Lambda function
    auto square = [](int x) { return x * x; };
    cout << square(5) << endl;  // 25

    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "go",
    slug: "go",
    name: "Go",
    icon: "🔵",
    color: "bg-cyan-500",
    description:
      "A simple, efficient language by Google. Great for building scalable backend services and infrastructure tools.",
    topics: [
      {
        id: "go-basics",
        slug: "basics",
        title: "Go Fundamentals",
        description:
          "Go syntax, goroutines, channels, and the Go way of doing things.",
        order: 1,
        keyTakeaways: [
          "Go is simple by design — few keywords",
          "Goroutines make concurrency easy",
          "No classes — uses structs and interfaces",
        ],
        content: `## Go Fundamentals

Go (Golang) is designed for **simplicity and efficiency**. By Google, for building scalable and reliable systems.

### Key Features
- **Simple syntax**: 25 keywords
- **Goroutines**: Lightweight concurrent functions
- **Channels**: Communication between goroutines
- **No classes**: Uses structs + interfaces
- **Fast compilation**: Near-instant builds
- **Built-in tooling**: \`go fmt\`, \`go test\`, \`go mod\``,
        codeExamples: [
          {
            language: "go",
            label: "Go",
            code: `package main

import (
    "fmt"
    "strings"
)

// Struct (no classes in Go)
type User struct {
    Name  string
    Email string
    Age   int
}

// Method on struct
func (u User) Greet() string {
    return fmt.Sprintf("Hello, I'm %s!", u.Name)
}

// Interface
type Greeter interface {
    Greet() string
}

func printGreeting(g Greeter) {
    fmt.Println(g.Greet())
}

func main() {
    // Variables
    name := "codespace"
    count := 42
    fmt.Printf("Welcome to %s! Count: %d\\n", name, count)

    // Slices (dynamic arrays)
    nums := []int{5, 2, 8, 1, 9}
    fmt.Println(nums)

    // Maps
    languages := map[string]int{
        "Go":     2009,
        "Python": 1991,
    }
    languages["Rust"] = 2010

    for lang, year := range languages {
        fmt.Printf("%s: %d\\n", lang, year)
    }

    // Struct usage
    user := User{Name: "Alice", Email: "a@b.com", Age: 30}
    printGreeting(user)

    // String operations
    words := strings.Split("Learn Code Interview", " ")
    fmt.Println(words)
}`,
          },
        ],
      },
    ],
  },
];

export function getLanguageBySlug(slug: string): Language | undefined {
  return languages.find((l) => l.slug === slug);
}

export function getLanguageTopic(langSlug: string, topicSlug: string) {
  const lang = getLanguageBySlug(langSlug);
  if (!lang) return undefined;
  return lang.topics.find((t) => t.slug === topicSlug);
}
