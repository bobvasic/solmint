from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/health')
def health_check():
    """
    A simple endpoint to verify that the backend is running.
    """
    return jsonify({"status": "healthy", "message": "SolMint backend is running."})

if __name__ == '__main__':
    app.run(debug=True)