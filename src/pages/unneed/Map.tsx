import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Check, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const VietnamAddressSelector = () => {
  // State management
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [streetName, setStreetName] = useState('');
  
  const [markerPosition, setMarkerPosition] = useState(null);
  const [isValidLocation, setIsValidLocation] = useState(true);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  
  const mapRef = useRef(null);
  const wardBoundary = useRef(null);

  // Load provinces khi component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      const response = await fetch('https://provinces.open-api.vn/api/p/');
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  };

  // Load districts khi chọn province
  useEffect(() => {
    if (selectedProvince) {
      loadDistricts(selectedProvince.code);
      setDistricts([]);
      setWards([]);
      setSelectedDistrict(null);
      setSelectedWard(null);
    }
  }, [selectedProvince]);

  const loadDistricts = async (provinceCode) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  // Load wards khi chọn district
  useEffect(() => {
    if (selectedDistrict) {
      loadWards(selectedDistrict.code);
      setWards([]);
      setSelectedWard(null);
    }
  }, [selectedDistrict]);

  const loadWards = async (districtCode) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      const data = await response.json();
      setWards(data.wards || []);
    } catch (error) {
      console.error('Error loading wards:', error);
    }
  };

  // Khởi tạo Leaflet Map
  useEffect(() => {
    if (selectedWard && mapRef.current && !map) {
      initMap();
    }
  }, [selectedWard]);

  const initMap = async () => {
    // Geocode để lấy tọa độ và boundary của phường/xã
    const address = `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}, Vietnam`;
    console.log("Địa chỉ: ",address)
    try {
      // Sử dụng Nominatim API của OpenStreetMap để geocoding
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&polygon_geojson=1&addressdetails=1`
      );
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData && geocodeData.length > 0) {
        const result = geocodeData[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        // Tạo map
        const mapInstance = L.map(mapRef.current).setView([lat, lng], 15);
        
        // Thêm tile layer từ OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstance);
        
        // Fix icon issue với Leaflet
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        // Tạo custom icon đỏ cho marker không hợp lệ
        const redIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        // Tạo marker
        const markerInstance = L.marker([lat, lng], {
          draggable: true,
          autoPan: true
        }).addTo(mapInstance);
        
        markerInstance.bindPopup('Kéo marker để chọn vị trí chính xác').openPopup();
        
        setMap(mapInstance);
        setMarker(markerInstance);
        setMarkerPosition({ lat, lng });
        
        // Vẽ boundary nếu có geojson
        if (result.geojson) {
          const geoJsonLayer = L.geoJSON(result.geojson, {
            style: {
              color: '#3388ff',
              weight: 2,
              opacity: 0.6,
              fillOpacity: 0.1
            }
          }).addTo(mapInstance);
          
          // Lưu boundary để kiểm tra
          wardBoundary.current = geoJsonLayer;
          
          // Zoom to fit boundary
          mapInstance.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });
        } else {
          // Nếu không có boundary, lấy bounding box từ kết quả
          if (result.boundingbox) {
            const bbox = result.boundingbox;
            const bounds = [
              [parseFloat(bbox[0]), parseFloat(bbox[2])],
              [parseFloat(bbox[1]), parseFloat(bbox[3])]
            ];
            
            // Vẽ rectangle cho boundary
            const rectangle = L.rectangle(bounds, {
              color: '#3388ff',
              weight: 2,
              opacity: 0.6,
              fillOpacity: 0.1
            }).addTo(mapInstance);
            
            wardBoundary.current = rectangle;
            mapInstance.fitBounds(bounds, { padding: [50, 50] });
          }
        }
        
        // Lắng nghe sự kiện kéo marker
        markerInstance.on('dragend', function(e) {
          const position = e.target.getLatLng();
          handleMarkerDrag(position, markerInstance, redIcon);
        });
        
      } else {
        console.error('Không tìm thấy địa chỉ');
        alert('Không tìm thấy vị trí của địa chỉ này trên bản đồ');
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      alert('Có lỗi xảy ra khi tải bản đồ');
    }
  };

  const handleMarkerDrag = (latLng, markerInstance, redIcon) => {
    const newPosition = { lat: latLng.lat, lng: latLng.lng };
    setMarkerPosition(newPosition);
    
    // Kiểm tra xem vị trí mới có nằm trong boundary không
    if (wardBoundary.current) {
      let isValid = false;
      
      // Kiểm tra theo loại boundary
      if (wardBoundary.current.getBounds) {
        const bounds = wardBoundary.current.getBounds();
        isValid = bounds.contains(latLng);
      }
      
      setIsValidLocation(isValid);
      
      // Đổi màu marker nếu không hợp lệ
      if (!isValid) {
        markerInstance.setIcon(redIcon);
        markerInstance.bindPopup('⚠️ Vị trí nằm ngoài khu vực cho phép!').openPopup();
      } else {
        markerInstance.setIcon(new L.Icon.Default());
        markerInstance.bindPopup('✓ Vị trí hợp lệ').openPopup();
      }
    }
  };

  // Cleanup map khi component unmount hoặc chọn phường mới
  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
        setMap(null);
        setMarker(null);
        wardBoundary.current = null;
      }
    };
  }, [selectedWard]);

  // Tạo địa chỉ đầy đủ
  const getFullAddress = () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard || !streetName) {
      return '';
    }
    
    return `${streetName}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}, Việt Nam`;
  };

  // Gửi dữ liệu đến API
  const handleSubmit = async () => {
    if (!isValidLocation) {
      alert('Vui lòng chọn vị trí trong khu vực đã chỉ định!');
      return;
    }
    
    if (!streetName.trim()) {
      alert('Vui lòng nhập tên đường!');
      return;
    }
    
    const addressData = {
      province: {
        code: selectedProvince.code,
        name: selectedProvince.name
      },
      district: {
        code: selectedDistrict.code,
        name: selectedDistrict.name
      },
      ward: {
        code: selectedWard.code,
        name: selectedWard.name
      },
      street: streetName,
      fullAddress: getFullAddress(),
      coordinates: markerPosition
    };
    
    try {
      // Gửi đến API
      const response = await fetch('/api/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData)
      });
      
      const result = await response.json();
      console.log('Address saved:', result);
      alert('Địa chỉ đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Có lỗi xảy ra khi lưu địa chỉ!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Chọn địa chỉ Việt Nam</h2>
      
      {/* Quốc gia */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quốc gia
        </label>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-300">
          <Check className="text-green-600" size={20} />
          <span className="font-medium">Việt Nam</span>
        </div>
      </div>

      {/* Tỉnh/Thành phố */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tỉnh/Thành phố *
        </label>
        <select
          value={selectedProvince?.code || ''}
          onChange={(e) => {
            const province = provinces.find(p => p.code === parseInt(e.target.value));
            setSelectedProvince(province);
          }}
          className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Chọn Tỉnh/Thành phố --</option>
          {provinces.map(province => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quận/Huyện */}
      {selectedProvince && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quận/Huyện *
          </label>
          <select
            value={selectedDistrict?.code || ''}
            onChange={(e) => {
              const district = districts.find(d => d.code === parseInt(e.target.value));
              setSelectedDistrict(district);
            }}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Chọn Quận/Huyện --</option>
            {districts.map(district => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Phường/Xã */}
      {selectedDistrict && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phường/Xã *
          </label>
          <select
            value={selectedWard?.code || ''}
            onChange={(e) => {
              const ward = wards.find(w => w.code === parseInt(e.target.value));
              setSelectedWard(ward);
              // Reset map khi chọn phường mới
              if (map) {
                map.remove();
                setMap(null);
                setMarker(null);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Chọn Phường/Xã --</option>
            {wards.map(ward => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tên đường */}
      {selectedWard && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên đường/Số nhà *
          </label>
          <input
            type="text"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
            placeholder="VD: 123 Nguyễn Huệ"
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Bản đồ OpenStreetMap */}
      {selectedWard && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin size={18} />
            Chọn vị trí chính xác trên bản đồ *
          </label>
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded border-2 border-gray-300 z-0"
          />
          
          {!isValidLocation && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">
                Vị trí đã chọn nằm ngoài khu vực {selectedWard.name}. Vui lòng kéo marker vào trong khu vực!
              </span>
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-600">
            💡 Kéo marker (pin) để chọn vị trí chính xác của bạn
          </p>
        </div>
      )}

      {/* Hiển thị địa chỉ đầy đủ */}
      {selectedWard && streetName && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ:</p>
          <p className="text-gray-900">{getFullAddress()}</p>
          {markerPosition && (
            <p className="text-sm text-gray-600 mt-2">
              📍 Tọa độ: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
            </p>
          )}
        </div>
      )}

      {/* Nút submit */}
      <button
        onClick={handleSubmit}
        disabled={!selectedWard || !streetName || !markerPosition || !isValidLocation}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Xác nhận địa chỉ
      </button>
    </div>
  );
};

export default VietnamAddressSelector;