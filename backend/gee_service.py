import ee
import datetime
import os

GEE_PROJECT_ID = os.getenv('GEE_PROJECT_ID', 'my-project-35947-484710')  

INDICATORS_CONFIG = {
    'NDVI': {'type': 'S2', 'name': 'NDVI (Vegetation)', 'vis': {'min': 0, 'max': 0.8, 'palette': ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850']}},
    'EVI':  {'type': 'S2', 'name': 'EVI (Enhanced Veg)', 'vis': {'min': 0, 'max': 0.8, 'palette': ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850']}},
    'SAVI': {'type': 'S2', 'name': 'SAVI (Soil Adjusted)', 'vis': {'min': 0, 'max': 0.8, 'palette': ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850']}},
    'LAI':  {'type': 'S2', 'name': 'LAI (Leaf Area)', 'vis': {'min': 0, 'max': 3, 'palette': ['white', 'green']}}, 
    
    'NDWI': {'type': 'S2', 'name': 'NDWI (Water)', 'vis': {'min': -0.5, 'max': 0.5, 'palette': ['#ffffff', '#deebf7', '#9ecae1', '#3182bd', '#08519c']}},
    'MNDWI':{'type': 'S2', 'name': 'MNDWI (Urban Water)', 'vis': {'min': -0.5, 'max': 0.5, 'palette': ['#ffffff', '#deebf7', '#9ecae1', '#3182bd', '#08519c']}},
    
    'NDBI': {'type': 'S2', 'name': 'NDBI (Built-up)', 'vis': {'min': -0.5, 'max': 0.5, 'palette': ['#2c003e', '#67008f', '#a900ba', '#e65c9e', '#ffaf7d', '#fff6a3']}},

    'LST':  {'type': 'MODIS', 'name': 'Land Surface Temp (C)', 'vis': {'min': 10, 'max': 45, 'palette': ['blue', 'yellow', 'red']}},
    'RAIN': {'type': 'CHIRPS', 'name': 'Total Rainfall (mm)', 'vis': {'min': 0, 'max': 300, 'palette': ['#ffffe5', '#f7fcb9', '#addd8e', '#41ab5d', '#238443', '#005a32']}},

    'ELEVATION': {'type': 'DEM', 'name': 'Elevation (m)', 'vis': {'min': 0, 'max': 2000, 'palette': ['006600', '002200', 'fff700', 'ab7634', 'c4d0ff', 'ffffff']}},
    'SLOPE':     {'type': 'DEM', 'name': 'Slope (deg)', 'vis': {'min': 0, 'max': 60, 'palette': ['black', 'white']}},

    'SAR':  {'type': 'S1', 'name': 'SAR Radar (VV)', 'vis': {'min': -25, 'max': 0, 'palette': ['black', 'white']}},
}

def initialize_gee():


    try:
        if GEE_PROJECT_ID and GEE_PROJECT_ID != 'ee-mohamed-projet' and GEE_PROJECT_ID != 'your-project-id-here':
            print(f"Initializing GEE with project: {GEE_PROJECT_ID}")
            ee.Initialize(project=GEE_PROJECT_ID)
        else:
            print("Initializing GEE with default project (no project ID specified)")
            print("To use your own project, set GEE_PROJECT_ID environment variable or modify gee_service.py")
            ee.Initialize()
    except Exception as e:
        print(f"GEE Initialization failed: {e}")
        print("Attempting to authenticate...")
        try:
            ee.Authenticate()
            if GEE_PROJECT_ID and GEE_PROJECT_ID != 'ee-mohamed-projet' and GEE_PROJECT_ID != 'your-project-id-here':
                ee.Initialize(project=GEE_PROJECT_ID)
            else:
                ee.Initialize()
        except Exception as e2:
            raise RuntimeError(f"GEE Authentication failed: {e2}\nPlease run: earthengine authenticate")

def get_indicator_layer(coords, date_start=None, date_end=None, indicator='NDVI'):
    roi = ee.Geometry.Rectangle([coords['west'], coords['south'], coords['east'], coords['north']])
    
    if not date_end: date_end = datetime.date.today().strftime('%Y-%m-%d')
    if not date_start: date_start = (datetime.date.today() - datetime.timedelta(days=30)).strftime('%Y-%m-%d')

    indicator = indicator.upper()
    config = INDICATORS_CONFIG.get(indicator, INDICATORS_CONFIG['NDVI'])
    dtype = config['type']
    
    print(f"Processing {indicator} ({dtype}) from {date_start} to {date_end}")

    image = None

    if dtype == 'S2':
        image = get_sentinel2_image(roi, date_start, date_end, indicator)
    elif dtype == 'S1':
        image = get_sentinel1_image(roi, date_start, date_end)
    elif dtype == 'MODIS':
        image = get_modis_image(roi, date_start, date_end)
    elif dtype == 'CHIRPS':
        image = get_chirps_image(roi, date_start, date_end)
    elif dtype == 'DEM':
        image = get_dem_image(roi)

    if not image:
        raise ValueError("Could not generate image")

    image = image.clip(roi)
    map_id = ee.Image(image).getMapId(config['vis'])
    return map_id['tile_fetcher'].url_format


def get_sentinel2_image(roi, start, end, indicator):
    s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
           .filterBounds(roi) \
           .filterDate(start, end) \
           .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
           .map(mask_s2_clouds)
    
    composite = s2.median()
    
    if indicator == 'NDVI': return composite.normalizedDifference(['B8', 'B4'])
    if indicator == 'NDWI': return composite.normalizedDifference(['B3', 'B8'])
    if indicator == 'MNDWI': return composite.normalizedDifference(['B3', 'B11'])
    if indicator == 'NDBI': return composite.normalizedDifference(['B11', 'B8'])
    if indicator == 'LAI': return composite.normalizedDifference(['B8', 'B4']).multiply(3) 
    if indicator == 'EVI':
        return composite.expression(
            '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
            {'NIR': composite.select('B8'), 'RED': composite.select('B4'), 'BLUE': composite.select('B2')}
        )
    if indicator == 'SAVI':
        return composite.expression(
           '((NIR - RED) / (NIR + RED + 0.5)) * 1.5',
           {'NIR': composite.select('B8'), 'RED': composite.select('B4')}
        )
    return composite.select(['B4', 'B3', 'B2']) 

def get_sentinel1_image(roi, start, end):
    s1 = ee.ImageCollection('COPERNICUS/S1_GRD') \
           .filterBounds(roi) \
           .filterDate(start, end) \
           .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV')) \
           .filter(ee.Filter.eq('instrumentMode', 'IW'))
    return s1.select('VV').mean()

def get_modis_image(roi, start, end):
    modis = ee.ImageCollection('MODIS/006/MOD11A2') \
              .filterBounds(roi) \
              .filterDate(start, end)
    def to_celsius(img):
        return img.select('LST_Day_1km').multiply(0.02).subtract(273.15)
    return modis.map(to_celsius).mean()

def get_chirps_image(roi, start, end):
    chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/PENTAD') \
               .filterBounds(roi) \
               .filterDate(start, end)
    return chirps.select('precipitation').sum()

def get_dem_image(roi):
    dem = ee.Image("NASA/NASADEM_HGT/001").select('elevation')
    return dem 

def mask_s2_clouds(image):
    qa = image.select('QA60')
    mask = qa.bitwiseAnd(1<<10).eq(0).And(qa.bitwiseAnd(1<<11).eq(0))
    return image.updateMask(mask).divide(10000)


CROP_YIELDS = {
    'wheat': {'base_yield': 5.5, 'price_per_ton': 250},
    'corn': {'base_yield': 9.5, 'price_per_ton': 200},
    'rice': {'base_yield': 6.0, 'price_per_ton': 400},
    'soybean': {'base_yield': 3.2, 'price_per_ton': 450}
}

def calculate_dashboard_metrics(coords, date_start, date_end, crop_type, input_costs):


    roi = ee.Geometry.Rectangle([coords['west'], coords['south'], coords['east'], coords['north']])
    
    if not date_end: date_end = datetime.date.today().strftime('%Y-%m-%d')
    if not date_start: date_start = (datetime.date.today() - datetime.timedelta(days=90)).strftime('%Y-%m-%d')
    
    area_m2 = roi.area().getInfo()
    area_ha = area_m2 / 10000
    
    productivity = calculate_productivity_index(roi, date_start, date_end, crop_type)
    
    weather_risk = calculate_weather_risk(roi, date_start, date_end)
    
    pest_risk = calculate_pest_risk(roi, date_start, date_end)
    
    soil_health = calculate_soil_proxies(roi)
    
    financial = calculate_financial_metrics(
        productivity, area_ha, crop_type, input_costs
    )
    
    irrigation = calculate_irrigation_needs(roi, date_start, date_end, weather_risk)
    
    fertilization = generate_fertilization_recommendations(soil_health, productivity)
    
    return {
        'area_hectares': round(area_ha, 2),
        'productivity_index': productivity,
        'weather_risk': weather_risk,
        'pest_risk': pest_risk,
        'soil_health': soil_health,
        'financial': financial,
        'irrigation': irrigation,
        'fertilization': fertilization,
        'crop_type': crop_type
    }

def calculate_productivity_index(roi, start, end, crop_type):
    
    s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
           .filterBounds(roi) \
           .filterDate(start, end) \
           .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
           .map(mask_s2_clouds)
    
    def calc_ndvi(img):
        return img.normalizedDifference(['B8', 'B4']).rename('NDVI')
    
    ndvi_collection = s2.map(calc_ndvi)
    
    mean_ndvi = ndvi_collection.mean().reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=10,
        maxPixels=1e9
    ).getInfo()
    
    ndvi_value = mean_ndvi.get('NDVI', 0.5)
    
    crop_params = CROP_YIELDS.get(crop_type, CROP_YIELDS['wheat'])
    
    if ndvi_value < 0.3:
        yield_factor = 0.3
    elif ndvi_value < 0.5:
        yield_factor = 0.6
    elif ndvi_value < 0.7:
        yield_factor = 0.85
    else:
        yield_factor = 1.0
    
    expected_yield = crop_params['base_yield'] * yield_factor
    
    return {
        'mean_ndvi': round(ndvi_value, 3),
        'health_status': get_health_status(ndvi_value),
        'expected_yield_tons_ha': round(expected_yield, 2),
        'yield_factor': round(yield_factor, 2)
    }

def calculate_weather_risk(roi, start, end):
    
    modis = ee.ImageCollection('MODIS/006/MOD11A2') \
              .filterBounds(roi) \
              .filterDate(start, end)
    
    def to_celsius(img):
        return img.select('LST_Day_1km').multiply(0.02).subtract(273.15)
    
    temp_stats = modis.map(to_celsius).reduce(ee.Reducer.mean().combine(
        ee.Reducer.max(), '', True
    )).reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=1000,
        maxPixels=1e9
    ).getInfo()
    
    chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/PENTAD') \
               .filterBounds(roi) \
               .filterDate(start, end)
    
    rain_stats = chirps.select('precipitation').reduce(
        ee.Reducer.sum().combine(ee.Reducer.mean(), '', True)
    ).reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=5000,
        maxPixels=1e9
    ).getInfo()
    
    avg_temp = temp_stats.get('LST_Day_1km_mean', 25)
    max_temp = temp_stats.get('LST_Day_1km_max', 30)
    total_rain = rain_stats.get('precipitation_sum', 100)
    
    temp_risk = 'high' if max_temp > 35 or avg_temp < 10 else 'low'
    rain_risk = 'high' if total_rain < 50 or total_rain > 500 else 'low'
    
    overall_risk = 'high' if temp_risk == 'high' or rain_risk == 'high' else 'moderate'
    
    return {
        'avg_temperature_c': round(avg_temp, 1),
        'max_temperature_c': round(max_temp, 1),
        'total_rainfall_mm': round(total_rain, 1),
        'temperature_risk': temp_risk,
        'rainfall_risk': rain_risk,
        'overall_risk': overall_risk
    }

def calculate_pest_risk(roi, start, end):
    
    modis = ee.ImageCollection('MODIS/006/MOD11A2') \
              .filterBounds(roi) \
              .filterDate(start, end)
    
    temp_mean = modis.select('LST_Day_1km').mean().multiply(0.02).subtract(273.15) \
                     .reduceRegion(
                         reducer=ee.Reducer.mean(),
                         geometry=roi,
                         scale=1000,
                         maxPixels=1e9
                     ).getInfo()
    
    temp = temp_mean.get('LST_Day_1km', 20)
    
    if 20 <= temp <= 30:
        risk_score = 0.7
        risk_level = 'high'
    elif 15 <= temp <= 35:
        risk_score = 0.4
        risk_level = 'moderate'
    else:
        risk_score = 0.2
        risk_level = 'low'
    
    return {
        'risk_score': round(risk_score, 2),
        'risk_level': risk_level,
        'avg_temperature_c': round(temp, 1),
        'recommendation': get_pest_recommendation(risk_level)
    }

def calculate_soil_proxies(roi):
    
    s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
           .filterBounds(roi) \
           .filterDate(datetime.date.today() - datetime.timedelta(days=60), datetime.date.today()) \
           .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)) \
           .map(mask_s2_clouds) \
           .median()
    
    ndmi = s2.normalizedDifference(['B8', 'B11'])
    
    stats = ndmi.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=10,
        maxPixels=1e9
    ).getInfo()
    
    moisture_index = stats.get('nd', 0.3)
    
    if moisture_index > 0.4:
        health = 'good'
        nitrogen_status = 'adequate'
    elif moisture_index > 0.2:
        health = 'moderate'
        nitrogen_status = 'low'
    else:
        health = 'poor'
        nitrogen_status = 'deficient'
    
    return {
        'moisture_index': round(moisture_index, 3),
        'health_status': health,
        'nitrogen_status': nitrogen_status,
        'organic_matter': 'moderate'  
    }

def calculate_financial_metrics(productivity, area_ha, crop_type, input_costs):
    
    crop_params = CROP_YIELDS.get(crop_type, CROP_YIELDS['wheat'])
    
    expected_yield_total = productivity['expected_yield_tons_ha'] * area_ha
    expected_revenue = expected_yield_total * crop_params['price_per_ton']
    total_costs = input_costs * area_ha
    net_profit = expected_revenue - total_costs
    roi = (net_profit / total_costs * 100) if total_costs > 0 else 0
    
    return {
        'expected_yield_total_tons': round(expected_yield_total, 2),
        'expected_revenue_usd': round(expected_revenue, 2),
        'total_input_costs_usd': round(total_costs, 2),
        'net_profit_usd': round(net_profit, 2),
        'roi_percent': round(roi, 1),
        'price_per_ton_usd': crop_params['price_per_ton']
    }

def calculate_irrigation_needs(roi, start, end, weather_risk):
    
    total_rain = weather_risk['total_rainfall_mm']
    avg_temp = weather_risk['avg_temperature_c']
    
    if total_rain < 50:
        urgency = 'high'
        frequency = 'daily'
        amount_mm = 10
    elif total_rain < 100:
        urgency = 'moderate'
        frequency = 'every 2-3 days'
        amount_mm = 7
    else:
        urgency = 'low'
        frequency = 'weekly'
        amount_mm = 5
    
    return {
        'urgency': urgency,
        'recommended_frequency': frequency,
        'amount_per_session_mm': amount_mm,
        'next_irrigation': 'within 24h' if urgency == 'high' else 'within 3 days'
    }

def generate_fertilization_recommendations(soil_health, productivity):
    
    nitrogen_status = soil_health['nitrogen_status']
    ndvi = productivity['mean_ndvi']
    
    if nitrogen_status == 'deficient' or ndvi < 0.4:
        n_kg_ha = 120
        p_kg_ha = 60
        k_kg_ha = 80
        priority = 'high'
    elif nitrogen_status == 'low' or ndvi < 0.6:
        n_kg_ha = 80
        p_kg_ha = 40
        k_kg_ha = 50
        priority = 'moderate'
    else:
        n_kg_ha = 40
        p_kg_ha = 20
        k_kg_ha = 30
        priority = 'low'
    
    return {
        'nitrogen_kg_ha': n_kg_ha,
        'phosphorus_kg_ha': p_kg_ha,
        'potassium_kg_ha': k_kg_ha,
        'priority': priority,
        'application_method': 'split application recommended',
        'timing': 'apply before next growth stage'
    }

def get_health_status(ndvi):
    
    if ndvi > 0.7:
        return 'excellent'
    elif ndvi > 0.5:
        return 'good'
    elif ndvi > 0.3:
        return 'moderate'
    else:
        return 'poor'

def get_pest_recommendation(risk_level):
    
    if risk_level == 'high':
        return 'Implement immediate monitoring and consider preventive treatment'
    elif risk_level == 'moderate':
        return 'Regular monitoring recommended'
    else:
        return 'Continue routine observation'


def get_adaptive_scale(roi, base_scale=10, max_pixels=1e9):


    try:
        area_m2 = roi.area().getInfo()
        area_km2 = area_m2 / 1e6
        
        if area_km2 > 1000:
            scale = max(base_scale * 10, 100)  
            max_pixels = 1e9
        elif area_km2 > 100:
            scale = max(base_scale * 5, 50)  
            max_pixels = 1e9
        elif area_km2 > 10:
            scale = base_scale * 2  
            max_pixels = 1e9
        else:
            scale = base_scale  
            max_pixels = 1e9
        
        return scale, max_pixels
    except:
        return 100, 1e9

TOMATO_OPTIMAL_PARAMS = {
    'soil_moisture_min': 0.3,  
    'soil_moisture_optimal': 0.5,  
    'soil_moisture_max': 0.7,  
    'temperature_optimal_min': 18,  
    'temperature_optimal_max': 25,  
    'rainfall_weekly_optimal': 25,  
    'ndvi_healthy_min': 0.5,  
    'evapotranspiration_daily': 5,  
}

def calculate_tomato_irrigation_optimization(coords, date_start=None, date_end=None):


    roi = ee.Geometry.Rectangle([coords['west'], coords['south'], coords['east'], coords['north']])
    
    if not date_end: 
        date_end = datetime.date.today().strftime('%Y-%m-%d')
    if not date_start: 
        date_start = (datetime.date.today() - datetime.timedelta(days=14)).strftime('%Y-%m-%d')
    
    area_m2 = roi.area().getInfo()
    area_ha = area_m2 / 10000
    area_km2 = area_m2 / 1e6
    
    print(f"Calculating irrigation optimization for area: {area_ha:.2f} hectares ({area_km2:.2f} km²)")
    
    soil_moisture = calculate_soil_moisture_index(roi, date_start, date_end)
    
    precipitation = calculate_precipitation_stats(roi, date_start, date_end)
    
    temperature = calculate_temperature_stats(roi, date_start, date_end)
    
    vegetation_health = calculate_vegetation_health(roi, date_start, date_end)
    
    evapotranspiration = estimate_evapotranspiration(temperature, precipitation, vegetation_health)
    
    irrigation_params = optimize_irrigation_parameters(
        soil_moisture, precipitation, temperature, vegetation_health, evapotranspiration
    )
    
    water_deficit = calculate_water_deficit(
        soil_moisture, precipitation, evapotranspiration
    )
    
    recommendations = generate_tomato_recommendations(
        irrigation_params, water_deficit, soil_moisture, temperature, vegetation_health
    )
    
    return {
        'area_hectares': round(area_ha, 2),
        'analysis_period': {
            'start': date_start,
            'end': date_end
        },
        'soil_moisture': soil_moisture,
        'precipitation': precipitation,
        'temperature': temperature,
        'vegetation_health': vegetation_health,
        'evapotranspiration': evapotranspiration,
        'water_deficit': water_deficit,
        'optimal_irrigation': irrigation_params,
        'recommendations': recommendations,
        'crop_type': 'tomato'
    }

def calculate_soil_moisture_index(roi, start, end):
    
    s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
           .filterBounds(roi) \
           .filterDate(start, end) \
           .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
           .map(mask_s2_clouds) \
           .median()
    
    ndmi = s2.normalizedDifference(['B8', 'B11']).rename('NDMI')
    
    scale, max_pixels = get_adaptive_scale(roi, base_scale=10)
    
    stats = ndmi.reduceRegion(
        reducer=ee.Reducer.mean().combine(ee.Reducer.min().combine(ee.Reducer.max(), '', True), '', True),
        geometry=roi,
        scale=scale,
        maxPixels=max_pixels,
        bestEffort=True
    ).getInfo()
    
    mean_ndmi = stats.get('NDMI_mean', 0.3)
    min_ndmi = stats.get('NDMI_min', 0.1)
    max_ndmi = stats.get('NDMI_max', 0.5)
    
    if mean_ndmi < TOMATO_OPTIMAL_PARAMS['soil_moisture_min']:
        status = 'dry'
        priority = 'high'
    elif mean_ndmi < TOMATO_OPTIMAL_PARAMS['soil_moisture_optimal']:
        status = 'moderate'
        priority = 'moderate'
    elif mean_ndmi <= TOMATO_OPTIMAL_PARAMS['soil_moisture_max']:
        status = 'optimal'
        priority = 'low'
    else:
        status = 'waterlogged'
        priority = 'high'
    
    return {
        'ndmi_mean': round(mean_ndmi, 3),
        'ndmi_min': round(min_ndmi, 3),
        'ndmi_max': round(max_ndmi, 3),
        'status': status,
        'priority': priority
    }

def calculate_precipitation_stats(roi, start, end):
    
    chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/PENTAD') \
               .filterBounds(roi) \
               .filterDate(start, end)
    
    total_rain = chirps.select('precipitation').sum()
    avg_rain = chirps.select('precipitation').mean()
    
    scale, max_pixels = get_adaptive_scale(roi, base_scale=5000)
    
    stats = total_rain.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=scale,
        maxPixels=max_pixels,
        bestEffort=True
    ).getInfo()
    
    avg_stats = avg_rain.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=scale,
        maxPixels=max_pixels,
        bestEffort=True
    ).getInfo()
    
    total_mm = stats.get('precipitation', 0)
    avg_daily_mm = avg_stats.get('precipitation', 0)
    
    start_date = datetime.datetime.strptime(start, '%Y-%m-%d')
    end_date = datetime.datetime.strptime(end, '%Y-%m-%d')
    days = (end_date - start_date).days + 1
    
    weekly_avg = (total_mm / days) * 7 if days > 0 else 0
    
    return {
        'total_mm': round(total_mm, 1),
        'average_daily_mm': round(avg_daily_mm, 1),
        'average_weekly_mm': round(weekly_avg, 1),
        'days_analyzed': days,
        'status': 'adequate' if weekly_avg >= TOMATO_OPTIMAL_PARAMS['rainfall_weekly_optimal'] * 0.7 else 'insufficient'
    }

def calculate_temperature_stats(roi, start, end):
    
    modis = ee.ImageCollection('MODIS/006/MOD11A2') \
              .filterBounds(roi) \
              .filterDate(start, end)
    
    def to_celsius(img):
        return img.select('LST_Day_1km').multiply(0.02).subtract(273.15).rename('LST_C')
    
    temp_collection = modis.map(to_celsius)
    
    temp_mean = temp_collection.mean()
    temp_min = temp_collection.min()
    temp_max = temp_collection.max()
    
    scale, max_pixels = get_adaptive_scale(roi, base_scale=1000)
    
    mean_stats = temp_mean.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=scale,
        maxPixels=max_pixels,
        bestEffort=True
    ).getInfo()
    
    min_stats = temp_min.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=scale,
        maxPixels=max_pixels,
        bestEffort=True
    ).getInfo()
    
    max_stats = temp_max.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=scale,
        maxPixels=max_pixels,
        bestEffort=True
    ).getInfo()
    
    avg_temp = mean_stats.get('LST_C', 20)
    min_temp = min_stats.get('LST_C', 15)
    max_temp = max_stats.get('LST_C', 30)
    
    if TOMATO_OPTIMAL_PARAMS['temperature_optimal_min'] <= avg_temp <= TOMATO_OPTIMAL_PARAMS['temperature_optimal_max']:
        temp_status = 'optimal'
    elif avg_temp < TOMATO_OPTIMAL_PARAMS['temperature_optimal_min']:
        temp_status = 'cold'
    else:
        temp_status = 'hot'
    
    return {
        'average_c': round(avg_temp, 1),
        'min_c': round(min_temp, 1),
        'max_c': round(max_temp, 1),
        'status': temp_status
    }

def calculate_ndvi(img):
    
    return img.normalizedDifference(['B8', 'B4']).rename('NDVI')

def calculate_vegetation_health(roi, start, end):
    
    s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
           .filterBounds(roi) \
           .filterDate(start, end) \
           .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
           .map(mask_s2_clouds)
    
    ndvi_collection = s2.map(calculate_ndvi)
    
    scale, max_pixels = get_adaptive_scale(roi, base_scale=10)
    
    stats = ndvi_collection.mean().reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=scale,
        maxPixels=max_pixels,
        bestEffort=True
    ).getInfo()
    
    mean_ndvi = stats.get('NDVI', 0.5)
    
    health_status = get_health_status(mean_ndvi)
    
    return {
        'ndvi_mean': round(mean_ndvi, 3),
        'health_status': health_status,
        'is_healthy': mean_ndvi >= TOMATO_OPTIMAL_PARAMS['ndvi_healthy_min']
    }

def estimate_evapotranspiration(temp_stats, precip_stats, veg_health):
    
    base_et = TOMATO_OPTIMAL_PARAMS['evapotranspiration_daily']
    
    temp_factor = 1.0
    if temp_stats['average_c'] > 25:
        temp_factor = 1.3
    elif temp_stats['average_c'] < 18:
        temp_factor = 0.7
    
    veg_factor = 1.0
    if veg_health['is_healthy']:
        veg_factor = 1.2
    else:
        veg_factor = 0.8
    
    estimated_daily_et = base_et * temp_factor * veg_factor
    
    return {
        'daily_mm': round(estimated_daily_et, 1),
        'weekly_mm': round(estimated_daily_et * 7, 1)
    }

def calculate_water_deficit(soil_moisture, precipitation, evapotranspiration):
    
    weekly_et = evapotranspiration['weekly_mm']
    weekly_precip = precipitation['average_weekly_mm']
    
    soil_contribution = soil_moisture['ndmi_mean'] * 20  
    water_deficit = weekly_et - weekly_precip - soil_contribution
    
    if water_deficit < 0:
        deficit_status = 'surplus'
        deficit_mm = 0
    else:
        deficit_status = 'deficit'
        deficit_mm = water_deficit
    
    return {
        'weekly_deficit_mm': round(max(0, deficit_mm), 1),
        'status': deficit_status,
        'needs_irrigation': deficit_mm > 5  
    }

def optimize_irrigation_parameters(soil_moisture, precipitation, temperature, vegetation_health, evapotranspiration):
    
    water_deficit = calculate_water_deficit(soil_moisture, precipitation, evapotranspiration)
    
    base_amount = water_deficit['weekly_deficit_mm']
    
    if soil_moisture['status'] == 'dry':
        amount_mm = max(base_amount, 15)  
        frequency = 'every 2 days'
        urgency = 'high'
    elif soil_moisture['status'] == 'moderate':
        amount_mm = max(base_amount, 10)  
        frequency = 'every 3-4 days'
        urgency = 'moderate'
    elif soil_moisture['status'] == 'optimal':
        amount_mm = max(base_amount * 0.5, 5)  
        frequency = 'weekly'
        urgency = 'low'
    else:  
        amount_mm = 0
        frequency = 'none - drainage needed'
        urgency = 'high'
    
    if temperature['status'] == 'hot':
        amount_mm *= 1.2  
        frequency = 'more frequent' if urgency != 'low' else frequency
    elif temperature['status'] == 'cold':
        amount_mm *= 0.8  
    
    if temperature['average_c'] > 25:
        best_time = 'early morning (5-7 AM) or evening (6-8 PM)'
    else:
        best_time = 'early morning (6-8 AM)'
    
    return {
        'amount_per_session_mm': round(amount_mm, 1),
        'frequency': frequency,
        'urgency': urgency,
        'best_time_of_day': best_time,
        'total_weekly_mm': round(amount_mm * (7 / 3) if '2 days' in frequency else amount_mm, 1),  
        'method': 'drip irrigation recommended' if urgency in ['high', 'moderate'] else 'sprinkler or drip'
    }

def generate_tomato_recommendations(irrigation_params, water_deficit, soil_moisture, temperature, vegetation_health):
    
    recommendations = []
    
    if irrigation_params['urgency'] == 'high':
        recommendations.append({
            'priority': 'HIGH',
            'action': 'Immediate irrigation required',
            'details': f"Apply {irrigation_params['amount_per_session_mm']}mm of water {irrigation_params['frequency']}"
        })
    
    if soil_moisture['status'] == 'dry':
        recommendations.append({
            'priority': 'HIGH',
            'action': 'Increase soil moisture',
            'details': f"Current NDMI: {soil_moisture['ndmi_mean']} (dry). Target: {TOMATO_OPTIMAL_PARAMS['soil_moisture_optimal']}"
        })
    elif soil_moisture['status'] == 'waterlogged':
        recommendations.append({
            'priority': 'HIGH',
            'action': 'Improve drainage',
            'details': 'Soil is waterlogged. Consider drainage improvements before irrigation.'
        })
    
    if temperature['status'] == 'hot':
        recommendations.append({
            'priority': 'MODERATE',
            'action': 'Increase irrigation frequency',
            'details': f"High temperatures ({temperature['average_c']}°C) increase water needs. Irrigate {irrigation_params['best_time_of_day']}"
        })
    
    if not vegetation_health['is_healthy']:
        recommendations.append({
            'priority': 'MODERATE',
            'action': 'Monitor plant health',
            'details': f"NDVI: {vegetation_health['ndvi_mean']} indicates {vegetation_health['health_status']} health. Ensure adequate irrigation."
        })
    
    if water_deficit['needs_irrigation']:
        recommendations.append({
            'priority': 'MODERATE',
            'action': 'Address water deficit',
            'details': f"Weekly water deficit: {water_deficit['weekly_deficit_mm']}mm. Plan irrigation accordingly."
        })
    
    recommendations.append({
        'priority': 'INFO',
        'action': 'Best practices',
        'details': 'Water at the base of plants, avoid wetting leaves to prevent disease. Monitor soil moisture regularly.'
    })
    
    return recommendations

