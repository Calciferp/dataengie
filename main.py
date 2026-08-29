from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import uvicorn

app = FastAPI(title="Portfolio API - Felipe Tamayo")

# Configuración de CORS para permitir que tu Frontend web haga peticiones a tu Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambia "*" por tu dominio real (ej. "https://tudominio.com")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de validación de datos (Esquema Profesional)
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

@app.post("/api/contact")
async def receive_contact_form(contact: ContactMessage):
    try:
        # Aquí puedes agregar la lógica para guardar en base de datos (PostgreSQL/MongoDB)
        # o enviar un email usando smtplib / aiosmtplib.
        
        print(f"Nuevo mensaje recibido de: {contact.name} ({contact.email})")
        print(f"Asunto: {contact.subject}")
        print(f"Mensaje: {contact.message}")
        
        return {"status": "success", "message": "Mensaje procesado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno procesando el mensaje.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)