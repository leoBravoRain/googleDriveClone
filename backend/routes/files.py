from fastapi import APIRouter
from services.files_service import FileService

module_name = 'files'
# tags is for swagger documentation
router = APIRouter(prefix=f'/{module_name}', tags=[module_name])

# # TODO: manage pagination?
@router.get('/')
async def get_files():
    """Get all files"""
    try:

        # use service
        files = FileService().get_all_files()
        
        return {
            "files": files,
            "total": len(files)
        }
    except Exception as e:
        return {
            "error": f"Failed to fetch files: {str(e)}",
            "files": [],
            "total": 0
        } 