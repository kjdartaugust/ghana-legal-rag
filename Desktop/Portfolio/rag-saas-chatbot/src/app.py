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

    # Conversation history — stores all exchanges for context
    history = []

    while True:
        # Get user input
        user_input = input("\nYou: ").strip()

        # Skip empty input
        if not user_input:
            continue

        # Exit commands
        if user_input.lower() in ("quit", "exit"):
            print("Goodbye!")
            break

        # Reset conversation history
        if user_input.lower() == "reset":
            history = []
            print("Conversation history cleared.")
            continue

        # Run the RAG pipeline and get a response
        response = run_chain(user_input)

        # Print the response
        print(f"\nBot: {response}")

        # Append to conversation history
        history.append({"role": "user", "content": user_input})
        history.append({"role": "assistant", "content": response})


if __name__ == "__main__":
    main()