import json
from cart_optimizer import CartOptimizer

class WhatsAppBridge:
    """
    Bridge to handle incoming WhatsApp messages (via Twilio/Meta Webhook).
    """
    def __init__(self):
        self.optimizer = CartOptimizer()

    def parse_message(self, message_body):
        """
        Extremely basic NLP: treating newlines as list separators.
        """
        # "Milk\nEggs\nPasta" -> ["Milk", "Eggs", "Pasta"]
        items = [line.strip() for line in message_body.split('\n') if line.strip()]
        return items

    def handle_incoming_message(self, get_params, post_body):
        """
        Simulate webhook handler.
        """
        # 1. Parse content
        user_text = post_body.get('Body', '')
        items = self.parse_message(user_text)
        
        if not items:
            return "Hi! Send me a list of groceries (one per line) and I'll find the best prices."

        # 2. Optimize
        result = self.optimizer.optimize_cart(items)
        
        # 3. Format Response (WhatsApp friendly)
        response = "🛒 *Your Optimization Request*\n\n"
        
        for store, items in result['stores'].items():
            if not items: continue
            response += f"*{store}*:\n"
            for i in items:
                response += f"- {i['item']}: €{i['price']}\n"
            response += "\n"
            
        total = result['total_cost']
        response += f"💰 *Total Estimated*: €{total:.2f}\n"
        
        if result['swaps_found']:
            response += "\n💡 *Smart Swaps Available*:\n"
            for swap in result['swaps_found']:
                response += f"- Switch {swap['original']} -> {swap['swap_with']} (Save €{swap['savings']})\n"
                
        return response

if __name__ == "__main__":
    # Test Mock Message
    bridge = WhatsAppBridge()
    mock_body = {"Body": "Pasta\nMilk\nCoca Cola"}
    print(bridge.handle_incoming_message({}, mock_body))
