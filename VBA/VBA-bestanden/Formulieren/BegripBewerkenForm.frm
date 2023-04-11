VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} BegripBewerkenForm 
   Caption         =   "Begrip Bewerken"
   ClientHeight    =   4890
   ClientLeft      =   120
   ClientTop       =   465
   ClientWidth     =   8190
   OleObjectBlob   =   "BegripBewerkenForm.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "BegripBewerkenForm"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False

Option Explicit

Dim BegripData As iBegrip

Private oScrollForm As New clScrollForm

Private Sub UserForm_Initialize()
    CustomSystem.SystemButtonSettings frm:=Me, Show:=False
    
    Set BegripData = New clBegripAdo
    
    Me.Begrip.enabled = False
    If Selection.text = "" Or Len(Selection.text) = 1 Then
        Me.Begrip.Value = WaardelijstenForm.Begrippen.Value
        Me.Definitie.Value = WaardelijstenForm.DefinitieLabel.Caption
    Else
        Me.Begrip.Value = Trim(Selection.text)
        Me.Definitie.Value = GetDefinitie
    End If
    
    Me.WijzigenButton.enabled = False

    Set oScrollForm = New clScrollForm
    With oScrollForm
        Set .ScrollForm = Me
        .AddControls
    End With
End Sub

Private Sub Definitie_Change()
    If Me.Definitie.Value <> "" Then
        Me.WijzigenButton.enabled = True
    Else
        Me.WijzigenButton.enabled = False
    End If
End Sub

Private Sub WijzigenButton_Click()

    Dim currentPosition As Range
    
    Set currentPosition = Selection.Range

    BegripData.UpdateBegrip sDefinitie:=Me.Definitie.Value, sBegrip:=Me.Begrip.Value

    WaardelijstenForm.DefinitieLabel.Caption = Me.Definitie.Value
    
    Setup.GetBegrippenlijst
    Selection.TypeBackspace
    currentPosition.Select
    Unload Me
End Sub

Private Sub AnnulerenButton_Click()
    Unload Me
End Sub

Private Function GetDefinitie() As String

    GetDefinitie = BegripData.GetBegripDefinitie(Trim(Selection.text))

End Function

Private Sub UserForm_QueryClose(Cancel As Integer, CloseMode As Integer)
    UnhookListScroll
    oScrollForm.TerminateScroll
    Set oScrollForm = Nothing
End Sub

