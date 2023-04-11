VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} BegripToevoegenForm 
   Caption         =   "Begrip Toevoegen"
   ClientHeight    =   5016
   ClientLeft      =   120
   ClientTop       =   465
   ClientWidth     =   7995
   OleObjectBlob   =   "BegripToevoegenForm.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "BegripToevoegenForm"
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
    
    If Selection.text = "" Or Len(Selection.text) = 1 Then
        Me.Begrip.Value = ""
    Else
        Me.Begrip.Value = Trim(Selection.text)
    End If
    
    Me.BegripErrorLabel.Visible = False
    Me.ToevoegenButton.enabled = False

    Set oScrollForm = New clScrollForm
    With oScrollForm
        Set .ScrollForm = Me
        .AddControls
    End With
End Sub

Private Sub Begrip_Change()
    Me.BegripErrorLabel.Visible = False
    Me.ToevoegenButton.enabled = Trim(Me.Begrip.Value) <> "" And Trim(Me.Definitie.Value) <> ""
End Sub

Private Sub Definitie_Change()
    Me.ToevoegenButton.enabled = Trim(Me.Begrip.Value) <> "" And Trim(Me.Definitie.Value) <> ""
End Sub

Private Sub ToevoegenButton_Click()
    Dim bookmarkAddress As String
    Dim currentPosition As Range
    Dim p As Paragraph
    Dim screentipText As String

    Set currentPosition = Selection.Range

    If BegripExists Then
        Me.BegripErrorLabel.Visible = True
        Me.Begrip.SetFocus
        Me.ToevoegenButton.enabled = False

        Exit Sub
    End If

    AddBegrip

    Setup.GetBegrippenlijst
    Selection.TypeBackspace
    currentPosition.Select

    If Len(Selection.text) > 1 Then
        For Each p In ActiveDocument.Paragraphs
            If p.Style = "OP_Hoofdstuk" And InStr(p.Range.text, "BIJLAGE I ") Then
                Set p = p.Next(Count:=1)

                Do While p.Next(Count:=1).Style <> "OP_Hoofdstuk"
                    Set p = p.Next(Count:=1)

                    If p.Style = "OP_Begrip" And LCase(Left(Trim(p.Range.text), Len(Trim(p.Range.text)) - 1)) = LCase(Trim(Me.Begrip.Value)) Then
                        bookmarkAddress = p.Range.Bookmarks(1)
                        screentipText = p.Next(Count:=1).Range.text
                        Exit For
                    End If

                    If p.Next(Count:=1) Is Nothing Then
                        Exit For
                    End If
                Loop
            End If
        Next p
        
        ActiveDocument.Hyperlinks.Add Anchor:=Selection.Range, Address:="", SubAddress:=bookmarkAddress, _
            ScreenTip:=screentipText, TextToDisplay:=Trim(Selection.text)
    End If

    Unload Me
End Sub

Private Sub AnnulerenButton_Click()
    Unload Me
End Sub

Private Function BegripExists() As Boolean

    If BegripData.GetBegripDefinitie(sTerm:=Me.Begrip.Value) = "" Then
        BegripExists = False
    Else
        BegripExists = True
    End If
    
End Function

Private Sub AddBegrip()

    BegripData.AddBegrip sTerm:=Trim(Me.Begrip.Value), sDefinitie:=Trim(Me.Definitie.Value), sUUID:=DSO.GenerateUUID

End Sub

Private Sub UserForm_QueryClose(Cancel As Integer, CloseMode As Integer)
    UnhookListScroll
    oScrollForm.TerminateScroll
    Set oScrollForm = Nothing
End Sub
