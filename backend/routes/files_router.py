from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from services.files_service import FileService
import io

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

@router.post('/')
async def upload_file(file: UploadFile = File(...)):
    """Upload file to object storage and save metadata to database"""
    try:
        response = await FileService().upload_file(file)
        return response
    
    # TODO: normalize response
    except Exception as e:
        return {
            "error": f"Failed to upload file: {str(e)}",
            "file_id": None,
            "filename": None,
            "size": None
        }

@router.get("/{file_id}/download")
async def download_file(file_id: str):
    """Download a file by file_id"""
    try:
        file_service = FileService()
        file_data = file_service.download_file(file_id)
        
        # Create streaming response
        return StreamingResponse(
            io.BytesIO(file_data["data"]),
            media_type=file_data["content_type"],
            headers={
                "Content-Disposition": f"attachment; filename={file_data['filename']}",
                "Content-Length": str(file_data["size"])
            }
        )
        
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{file_id}")
async def delete_file(file_id: str):
    """Delete a file by file_id"""
    try:
        file_service = FileService()
        result = file_service.delete_file(file_id)
        return result
        
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{file_id}")
async def update_file(file_id: str, file_name: str):
    """Update the file name of the file with the given file_id"""
    try:
        file_service = FileService()
        result = file_service.update_file_name(file_id, file_name)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))