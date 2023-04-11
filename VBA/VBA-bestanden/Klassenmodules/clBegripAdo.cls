VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "clBegripAdo"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Option Explicit

Implements iBegrip

Dim commonAdoData As iCommon
Dim BegripData As iBegrip
Dim waardelijstenData As iWaardelijsten


Private Function iBegrip_GetBegripUUID(sNaamBegrip As String) As String
    Dim BegripUUID As Variant
    Dim sQuery, sQueryError As String
    
    sQueryError = "(GetBegripUUID) Kan tabel wBegrippenlijst niet openen:"
    sQuery = "SELECT UUID FROM wBegrippenlijst " & _
             "WHERE Term = '" & sNaamBegrip & "'"
    BegripUUID = commonAdoData.OpenExecClose(sQuery, sQueryError)
    iBegrip_GetBegripUUID = BegripUUID
End Function

Private Function iBegrip_DeleteBegrip(sBegrip As String) As Boolean
    Dim cmd As New ADODB.Command
    Dim rs As New ADODB.Recordset
    Dim sQuery, sQueryError As String
    
    Set commonAdoData = New clCommonAdo
    Err.Clear
    On Error GoTo errorHandler
    
    sQueryError = "(DeleteBegrip) Kan " & sBegrip & " niet verwijderen uit de database:"
    sQuery = "DELETE * FROM wBegrippenlijst WHERE term = '" & sBegrip & "';"
    With cmd
        .ActiveConnection = publicConnection
        .CommandText = sQuery
        .Execute
    End With
 
    iBegrip_DeleteBegrip = True
Proceed:
    commonAdoData.CloseAndCleanup rs:=rs
    Exit Function
    
errorHandler:
    commonAdoData.ErrorCloseAndCleanup sQueryError:=(sQueryError)
    iBegrip_DeleteBegrip = False
    Resume Proceed
End Function

Private Function iBegrip_SetBegrip(Id As String, UUID As String, Term As String, Definitie As String) As clBegrip
    Set iBegrip_SetBegrip = New clBegrip
    iBegrip_SetBegrip.InitiateProperties Id:=Id, UUID:=UUID, Term:=Term, Definitie:=Definitie
End Function

Private Function iBegrip_GetBegrippenlijst() As Scripting.Dictionary
        Dim rs As New ADODB.Recordset
        Dim sQuery, sQueryError As String
        Dim dBegrippenlijst As New Scripting.Dictionary

        Set commonAdoData = New clCommonAdo
        Err.Clear
        On Error GoTo errorHandler
        
        sQueryError = "(GetBegrippenlijst) Er ging iets mis bij het maken van de begrippenlijst:"
        sQuery = "SELECT * FROM wBegrippenlijst ORDER BY Term"
            
        rs.Open sQuery, publicConnection
        
        With rs
            If Not (.EOF And .BOF) Then
                .MoveFirst
                Do Until .EOF = True
                    Dim Begrip As clBegrip
                    Set Begrip = iBegrip_SetBegrip(Id:=!Id, UUID:=!UUID, Term:=!Term, Definitie:=!Definitie)
                    dBegrippenlijst.Add (!Id), Begrip
                    .MoveNext
                Loop
            End If
        End With
        
        Set iBegrip_GetBegrippenlijst = dBegrippenlijst
Proceed:
    commonAdoData.CloseAndCleanup rs:=rs
    Exit Function
    
errorHandler:
    commonAdoData.ErrorCloseAndCleanup sQueryError:=(sQueryError)
    Resume Proceed
End Function

Private Function iBegrip_UpdateBegrip(sDefinitie As String, sBegrip As String) As Boolean

    Dim cmd As New ADODB.Command
    Dim rs As New ADODB.Recordset
    Dim sQuery, sQueryError As String
    
    Set commonAdoData = New clCommonAdo
    On Error GoTo errorHandler
        
    cmd.ActiveConnection = publicConnection
    
    sQueryError = "(UpdateBegrip) Kan veld !Definitie niet wegschrijven naar de database:"
    sQuery = "UPDATE wBegrippenlijst SET Definitie = '" & sDefinitie & "' " & _
             "WHERE Term = '" & sBegrip & "';"
    
    cmd.CommandText = sQuery
    cmd.Execute
    
    iBegrip_UpdateBegrip = True
Proceed:
    commonAdoData.CloseAndCleanup rs:=rs
    Exit Function

errorHandler:
    commonAdoData.ErrorCloseAndCleanup sQueryError:=(sQueryError)
    iBegrip_UpdateBegrip = False
    Resume Proceed
End Function

Private Function iBegrip_GetBegripDefinitie(sTerm As String) As String
             
    Dim sQuery, sQueryError As String
    Dim BegripDefinitie As Variant
    
    Set commonAdoData = New clCommonAdo
         
    sQueryError = "(GetBegripDefinitie) Er ging iets mis bij het ophalen van de definitie van het geselecteerde begrip: "
    sQuery = "SELECT Definitie FROM wBegrippenlijst " & _
             "WHERE Term = '" & sTerm & "'"
    
    BegripDefinitie = commonAdoData.OpenExecClose(sQuery, sQueryError)
    iBegrip_GetBegripDefinitie = (BegripDefinitie)

End Function

Private Function iBegrip_AddBegrip(sTerm As String, sDefinitie As String, sUUID As String) As Boolean
    
    Dim cmd As New ADODB.Command
    Dim rs As New ADODB.Recordset
    Dim sQuery, sQueryError As String
            
    Set commonAdoData = New clCommonAdo
    On Error GoTo errorHandler
    
    cmd.ActiveConnection = publicConnection
    
    sQueryError = "(AddBegrip) Er ging iets mis tijdens het opslaan van het opgegeven begrip:"
    sQuery = "INSERT INTO wBegrippenlijst (Term, Definitie,UUID) " & _
             "VALUES ('" & _
             sTerm & "','" & _
             sDefinitie & "','" & _
             sUUID & "');"
            
    cmd.CommandText = sQuery
    cmd.Execute
    
    iBegrip_AddBegrip = True
    
Proceed:
    commonAdoData.CloseAndCleanup rs:=rs
    Exit Function

errorHandler:
    commonAdoData.ErrorCloseAndCleanup sQueryError:=sQueryError
    iBegrip_AddBegrip = False
    Resume Proceed
End Function


