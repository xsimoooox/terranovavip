from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import ee
import gee_service
import os

app = Flask(__name__, static_folder='../', static_url_path='/')
CORS(app)

# gee_service.initialize_gee()

@app.route('/')
def home():
    
    return send_from_directory('../', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    
    if path.startswith('api/'):
        return jsonify({"error": "Not found"}), 404
    try:
        return send_from_directory('../', path)
    except Exception as e:
        return jsonify({"error": "File not found"}), 404

@app.route('/api/analyze', methods=['POST'])
def analyze():


    try:
        data = request.json
        
        required_fields = ['north', 'south', 'east', 'west']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing coordinates. Requires north, south, east, west."}), 400
            
        coords = {
            'north': data['north'],
            'south': data['south'],
            'east': data['east'],
            'west': data['west']
        }
        
        date_start = data.get('date_start')
        date_end = data.get('date_end')
        indicator = data.get('indicator', 'NDVI') 

        tile_url = gee_service.get_indicator_layer(coords, date_start, date_end, indicator)
        
        return jsonify({
            "success": True,
            "tile_url": tile_url,
            "coords": coords,
            "indicator": indicator,
            "dates": {"start": date_start, "end": date_end}
        })

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/api/dashboard_stats', methods=['POST'])
def dashboard_stats():


    try:
        data = request.json
        
        required_fields = ['north', 'south', 'east', 'west']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing coordinates"}), 400
            
        coords = {
            'north': data['north'],
            'south': data['south'],
            'east': data['east'],
            'west': data['west']
        }
        
        date_start = data.get('date_start')
        date_end = data.get('date_end')
        crop_type = data.get('crop_type', 'wheat')
        input_costs = data.get('input_costs', 500)  
        
        stats = gee_service.calculate_dashboard_metrics(
            coords, date_start, date_end, crop_type, input_costs
        )
        
        return jsonify({
            "success": True,
            "stats": stats,
            "coords": coords,
            "dates": {"start": date_start, "end": date_end}
        })
        
    except Exception as e:
        print(f"Error in dashboard: {e}")
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/api/irrigation_recommendation', methods=['POST'])
def irrigation_recommendation():


    try:
        data = request.json
        
        required_fields = ['north', 'south', 'east', 'west']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing coordinates. Requires north, south, east, west."}), 400
            
        coords = {
            'north': data['north'],
            'south': data['south'],
            'east': data['east'],
            'west': data['west']
        }
        
        date_start = data.get('date_start')
        date_end = data.get('date_end')
        crop_type = data.get('crop_type', 'tomato')
        
        if crop_type.lower() != 'tomato':
            return jsonify({
                "error": f"Irrigation optimization currently only supports 'tomato'. Received: {crop_type}",
                "success": False
            }), 400
        
        recommendations = gee_service.calculate_tomato_irrigation_optimization(
            coords, date_start, date_end
        )
        
        return jsonify({
            "success": True,
            "recommendations": recommendations,
            "coords": coords,
            "dates": {"start": date_start, "end": date_end},
            "crop_type": crop_type
        })
        
    except Exception as e:
        print(f"Error in irrigation recommendation: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e), "success": False}), 500


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    print("\n" + "="*60)
    print("Satellite Intelligence Platform")
    print("="*60)
    print(f"Serveur démarré sur http://127.0.0.1:{port}")
    print(f"Ouvrez votre navigateur à : http://127.0.0.1:{port}")
    print(f"Interface disponible directement dans le navigateur")
    print("="*60 + "\n")
    app.run(debug=True, port=port, host='127.0.0.1')
