VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "clBegrip"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Option Explicit

Private p_UUID As String
Private p_Id As String
Private p_Term As String
Private p_Definitie As String

Public Property Get Id() As String
    Id = p_Id
End Property

Public Property Get UUID() As String
    UUID = p_UUID
End Property

Public Property Get Term() As String
    Term = p_Term
End Property

Public Property Get Definitie() As String
    Definitie = p_Definitie
End Property

Public Sub InitiateProperties(Id As String, UUID As String, Term As String, Definitie As String)
    p_UUID = UUID
    p_Id = Id
    p_Term = Term
    p_Definitie = Definitie
End Sub
