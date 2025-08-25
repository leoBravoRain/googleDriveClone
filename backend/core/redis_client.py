import redis
import json
from typing import Optional, Any
import logging

logger = logging.getLogger(__name__)

class RedisClient:
    def __init__(self, host: str = 'redis', port: int = 6379, db: int = 0):
        try:
            self.redis = redis.Redis(
                host=host,
                port=port,
                db=db,
                decode_responses=True,  # This automatically decodes bytes to strings
                socket_connect_timeout=5,
                socket_timeout=5
            )
            # Test connection
            self.redis.ping()
            logger.info("Redis connection established successfully")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            self.redis = None

    def set_cache(self, key: str, value: Any, expire: int = 3600) -> bool:
        """
        Set cache with expiration (default 1 hour)
        Args:
            key: Cache key
            value: Value to cache (will be JSON serialized)
            expire: Expiration time in seconds
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            if self.redis is None:
                logger.warning("Redis not available, skipping cache set")
                return False

            # Serialize the value to JSON
            serialized_value = json.dumps(value, default=str)
            self.redis.setex(key, expire, serialized_value)
            logger.info(f"Cache set for key: {key} with expiration: {expire}s")
            return True
        except Exception as e:
            logger.error(f"Failed to set cache for key {key}: {e}")
            return False

    def get_cache(self, key: str) -> Optional[Any]:
        """
        Get cached value
        Args:
            key: Cache key
        Returns:
            Deserialized value or None if not found/error
        """
        try:
            if self.redis is None:
                logger.warning("Redis not available, skipping cache get")
                return None

            value = self.redis.get(key)
            if value is None:
                logger.info(f"Cache miss for key: {key}")
                return None

            # Deserialize JSON
            deserialized_value = json.loads(value)
            logger.info(f"Cache hit for key: {key}")
            return deserialized_value
        except json.JSONDecodeError as e:
            logger.error(f"Failed to deserialize cache for key {key}: {e}")
            return None
        except Exception as e:
            logger.error(f"Failed to get cache for key {key}: {e}")
            return None

    def is_connected(self) -> bool:
        """Check if Redis is connected"""
        try:
            if self.redis is None:
                return False
            self.redis.ping()
            return True
        except:
            return False
