import sys
import os

# Add src/ to the Python path so imports work correctly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from chain import run_chain


def main():
    """
    Main entry point — runs the health chatbot in the terminal.
    Commands:
    - Type your question and press Enter
    - Type 'quit' or 'exit' to stop
    - Type 'reset' to clear conversation history
    """

    print("=" * 50)
    print("Ghana Legal Q&A — RAG Powered")
    print("Type 'quit' to exit | 'reset' to clear history")
    print("=" * 50)

    history = []

    while True:
        user_input = input("\nYou: ").strip()

        if not user_input:
            continue

        if user_input.lower() in ("quit", "exit"):
            print("Goodbye!")
            break

        if user_input.lower() == "reset":
            history = []
            print("Conversation history cleared.")
            continue

        response = run_chain(user_input)
        print(f"\nBot: {response}")

        history.append({"role": "user", "content": user_input})
        history.append({"role": "assistant", "content": response})


if __name__ == "__main__":
    main()