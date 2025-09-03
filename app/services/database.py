import json
import os
import random
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path

class Database:
    def __init__(self):
        self.base_dir = Path(os.getenv('DATA_DIR', os.getcwd()))
        self.data_dir = self.base_dir / 'data'
        self.uploads_dir = self.base_dir / 'uploads'
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Create necessary directories"""
        self.data_dir.mkdir(exist_ok=True)
        self.uploads_dir.mkdir(exist_ok=True)
        print('✅ Database directories ensured')
    
    async def read_data(self, filename: str, default_value: List = None) -> List:
        """Read JSON data from file with fallback"""
        if default_value is None:
            default_value = []
        
        file_path = self.data_dir / filename
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if not isinstance(data, list):
                    print(f"⚠️ {filename} is not an array, using default")
                    return default_value
                return data
        except (FileNotFoundError, json.JSONDecodeError) as e:
            if isinstance(e, FileNotFoundError):
                # File doesn't exist, create it with default data
                await self.write_data(filename, default_value)
            else:
                print(f"❌ Error reading {filename}: {e}")
            return default_value
        except Exception as e:
            print(f"❌ Error reading {filename}: {e}")
            return default_value
    
    async def write_data(self, filename: str, data: List) -> bool:
        """Write JSON data to file atomically"""
        file_path = self.data_dir / filename
        temp_path = file_path.with_suffix('.tmp')
        
        try:
            with open(temp_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            temp_path.replace(file_path)  # Atomic rename
            print(f"✅ Data written to {filename}")
            return True
        except Exception as e:
            print(f"❌ Error writing {filename}: {e}")
            raise
    
    def generate_id(self, prefix: str = 'item') -> str:
        """Generate unique ID"""
        timestamp = int(datetime.now().timestamp() * 1000)
        random_str = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=6))
        return f"{prefix}-{timestamp}-{random_str}"
    
    def get_timestamp(self) -> str:
        """Get current timestamp"""
        return datetime.now().isoformat()

# Global database instance
db = Database()
