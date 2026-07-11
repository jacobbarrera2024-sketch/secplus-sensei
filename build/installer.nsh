!include LogicLib.nsh
!include FileFunc.nsh
!include WinMessages.nsh
!insertmacro GetParent

!ifndef BUILD_UNINSTALLER

!ifndef INSTALL_REGISTRY_KEY
  !define INSTALL_REGISTRY_KEY "Software\${APP_GUID}"
!endif
!ifndef UNINSTALL_REGISTRY_KEY
  !define UNINSTALL_REGISTRY_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}"
!endif

Var SecPlusHasExisting
Var SecPlusPrevVersion
Var SecPlusPrevLocation
Var SecPlusUninstallCmd
Var SecPlusRegSubKey
Var SecPlusOfferUpdate
Var SecPlusContinueInstall

Function SecPlusNameMatches
  StrCpy $R0 $R8 15
  StrCmp $R0 "SecPlus Sensei" 0 +2
  StrCpy $R0 "1"
  Return
  StrCpy $R0 "0"
FunctionEnd

Function SecPlusCaptureUninstallEntry
  StrCpy $SecPlusHasExisting "1"
  ${If} $R9 == "2"
    ReadRegStr $SecPlusPrevVersion HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\$SecPlusRegSubKey" "DisplayVersion"
    ReadRegStr $SecPlusUninstallCmd HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\$SecPlusRegSubKey" "UninstallString"
    ReadRegStr $R8 HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\$SecPlusRegSubKey" "DisplayIcon"
    ReadRegStr $R7 HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\$SecPlusRegSubKey" "InstallLocation"
  ${Else}
    ReadRegStr $SecPlusPrevVersion HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\$SecPlusRegSubKey" "DisplayVersion"
    ReadRegStr $SecPlusUninstallCmd HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\$SecPlusRegSubKey" "UninstallString"
    ReadRegStr $R8 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\$SecPlusRegSubKey" "DisplayIcon"
    ReadRegStr $R7 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\$SecPlusRegSubKey" "InstallLocation"
  ${EndIf}

  ${If} $SecPlusPrevVersion == ""
    StrCpy $SecPlusPrevVersion "unknown"
  ${EndIf}

  ${If} $R7 != ""
    StrCpy $SecPlusPrevLocation $R7
  ${ElseIf} $R8 != ""
    ${GetParent} $SecPlusPrevLocation $R8
  ${ElseIf} $SecPlusUninstallCmd != ""
    StrCpy $R8 $SecPlusUninstallCmd 1 1
    StrCpy $R0 $SecPlusUninstallCmd "" 1
    StrCpy $R8 $R0 -1
    ${GetParent} $SecPlusPrevLocation $R8
  ${EndIf}
FunctionEnd

Function SecPlusScanUninstallHiveLM
  StrCpy $R6 0
  scan_lm:
    EnumRegKey $SecPlusRegSubKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall" $R6
    StrCmp $SecPlusRegSubKey "" scan_lm_done
    ReadRegStr $R8 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\$SecPlusRegSubKey" "DisplayName"
    Call SecPlusNameMatches
    StrCmp $R0 "1" 0 scan_lm_next
    StrCpy $R9 "1"
    Call SecPlusCaptureUninstallEntry
    Return
  scan_lm_next:
    IntOp $R6 $R6 + 1
    Goto scan_lm
  scan_lm_done:
FunctionEnd

Function SecPlusScanUninstallHiveCU
  StrCpy $R6 0
  scan_cu:
    EnumRegKey $SecPlusRegSubKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall" $R6
    StrCmp $SecPlusRegSubKey "" scan_cu_done
    ReadRegStr $R8 HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\$SecPlusRegSubKey" "DisplayName"
    Call SecPlusNameMatches
    StrCmp $R0 "1" 0 scan_cu_next
    StrCpy $R9 "2"
    Call SecPlusCaptureUninstallEntry
    Return
  scan_cu_next:
    IntOp $R6 $R6 + 1
    Goto scan_cu
  scan_cu_done:
FunctionEnd

Function SecPlusTryExePath
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}
  ${If} ${FileExists} "$R1"
    StrCpy $SecPlusHasExisting "1"
    StrCpy $SecPlusPrevLocation $R2
    ${If} $SecPlusPrevVersion == ""
      StrCpy $SecPlusPrevVersion "unknown"
    ${EndIf}
    StrCpy $R3 "$R2\Uninstall ${PRODUCT_NAME}.exe"
    ${If} ${FileExists} "$R3"
      StrCpy $SecPlusUninstallCmd '"$R3" /allusers'
    ${EndIf}
    Return
  ${EndIf}
FunctionEnd

Function SecPlusTryKnownFolders
  ReadEnvStr $0 USERPROFILE
  StrCpy $R1 "$0\Desktop\${APP_FILENAME}\${PRODUCT_FILENAME}.exe"
  StrCpy $R2 "$0\Desktop\${APP_FILENAME}"
  Call SecPlusTryExePath
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}

  StrCpy $R1 "$0\Desktop\${APP_FILENAME}\${APP_FILENAME}\${PRODUCT_FILENAME}.exe"
  StrCpy $R2 "$0\Desktop\${APP_FILENAME}\${APP_FILENAME}"
  Call SecPlusTryExePath
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}

  StrCpy $R1 "$PROGRAMFILES64\${APP_FILENAME}\${PRODUCT_FILENAME}.exe"
  StrCpy $R2 "$PROGRAMFILES64\${APP_FILENAME}"
  Call SecPlusTryExePath
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}

  StrCpy $R1 "$PROGRAMFILES64\${APP_FILENAME}\${APP_FILENAME}\${PRODUCT_FILENAME}.exe"
  StrCpy $R2 "$PROGRAMFILES64\${APP_FILENAME}\${APP_FILENAME}"
  Call SecPlusTryExePath
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}

  StrCpy $R1 "$PROGRAMFILES\${APP_FILENAME}\${PRODUCT_FILENAME}.exe"
  StrCpy $R2 "$PROGRAMFILES\${APP_FILENAME}"
  Call SecPlusTryExePath
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}

  StrCpy $R1 "$PROGRAMFILES\${APP_FILENAME}\${APP_FILENAME}\${PRODUCT_FILENAME}.exe"
  StrCpy $R2 "$PROGRAMFILES\${APP_FILENAME}\${APP_FILENAME}"
  Call SecPlusTryExePath
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}

  ReadEnvStr $0 LOCALAPPDATA
  StrCpy $R1 "$0\Programs\${APP_FILENAME}\${PRODUCT_FILENAME}.exe"
  StrCpy $R2 "$0\Programs\${APP_FILENAME}"
  Call SecPlusTryExePath
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}

  StrCpy $R1 "$0\Programs\${APP_FILENAME}\${APP_FILENAME}\${PRODUCT_FILENAME}.exe"
  StrCpy $R2 "$0\Programs\${APP_FILENAME}\${APP_FILENAME}"
  Call SecPlusTryExePath
FunctionEnd

Function SecPlusFindExisting
  StrCpy $SecPlusHasExisting "0"
  StrCpy $SecPlusPrevVersion ""
  StrCpy $SecPlusPrevLocation ""
  StrCpy $SecPlusUninstallCmd ""

  SetRegView 64

  ReadRegStr $0 HKLM "${UNINSTALL_REGISTRY_KEY}" "DisplayVersion"
  ReadRegStr $1 HKLM "${UNINSTALL_REGISTRY_KEY}" "UninstallString"
  ReadRegStr $2 HKLM "${INSTALL_REGISTRY_KEY}" "InstallLocation"
  ${If} $1 != ""
    StrCpy $SecPlusHasExisting "1"
    StrCpy $SecPlusPrevVersion $0
    StrCpy $SecPlusUninstallCmd $1
    StrCpy $SecPlusPrevLocation $2
    ${If} $SecPlusPrevVersion == ""
      StrCpy $SecPlusPrevVersion "unknown"
    ${EndIf}
    ${If} $SecPlusPrevLocation == ""
      ReadRegStr $R8 HKLM "${UNINSTALL_REGISTRY_KEY}" "DisplayIcon"
      ${If} $R8 != ""
        ${GetParent} $SecPlusPrevLocation $R8
      ${EndIf}
    ${EndIf}
    Return
  ${EndIf}

  Call SecPlusScanUninstallHiveLM
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}

  Call SecPlusScanUninstallHiveCU
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}

  SetRegView 32
  Call SecPlusScanUninstallHiveLM
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}
  Call SecPlusScanUninstallHiveCU
  ${If} $SecPlusHasExisting == "1"
    Return
  ${EndIf}

  SetRegView 64
  Call SecPlusTryKnownFolders
FunctionEnd

Function SecPlusRunUninstall
  ClearErrors

  ; Registry UninstallString is the most reliable source (includes quoting + /allusers)
  ${If} $SecPlusUninstallCmd != ""
    ExecWait $SecPlusUninstallCmd $R0
    Return
  ${EndIf}

  StrCpy $R3 "$SecPlusPrevLocation\Uninstall ${PRODUCT_NAME}.exe"
  ${If} ${FileExists} "$R3"
    ExecWait '"$R3" /allusers _?=$SecPlusPrevLocation' $R0
    Return
  ${EndIf}

  MessageBox MB_OK|MB_ICONEXCLAMATION "Could not remove SecPlus Sensei. Remove it from Settings > Apps instead."
FunctionEnd

; nsDialogs OnClick cannot Quit or Abort out of the page — emulate Cancel (id 2), which closes setup.
Function SecPlusCloseInstaller
  GetDlgItem $0 $HWNDPARENT 2
  SendMessage $0 ${BM_CLICK} 0 0
FunctionEnd

; Always offer Update when an existing install is found (reinstall or upgrade).
Function SecPlusCheckOfferUpdate
  StrCpy $SecPlusOfferUpdate "1"
FunctionEnd

!macro preInit
  SetRegView 64
  Call SecPlusFindExisting
  ${If} $SecPlusHasExisting == "1"
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$SecPlusPrevLocation"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$SecPlusPrevLocation"
  ${EndIf}
!macroend

!macro customInstall
  StrCpy $R0 "$INSTDIR\${PRODUCT_FILENAME}.exe"
  ${If} ${FileExists} "$R0"
    Delete "$DESKTOP\${SHORTCUT_NAME}.lnk"
    CreateShortCut "$DESKTOP\${SHORTCUT_NAME}.lnk" "$R0" "" "$INSTDIR\appIcon.ico" 0 "" "" "${APP_DESCRIPTION}"
    !ifdef MENU_FILENAME
      Delete "$SMPROGRAMS\${MENU_FILENAME}\${SHORTCUT_NAME}.lnk"
      CreateShortCut "$SMPROGRAMS\${MENU_FILENAME}\${SHORTCUT_NAME}.lnk" "$R0" "" "$INSTDIR\appIcon.ico" 0 "" "" "${APP_DESCRIPTION}"
      CreateShortCut "$SMPROGRAMS\${MENU_FILENAME}\Update SecPlus Sensei.lnk" "$INSTDIR\SecPlus Sensei Updater.exe" "" "$INSTDIR\appIcon.ico" 0 "" "" "Install the latest SecPlus Sensei update"
    !else
      Delete "$SMPROGRAMS\${SHORTCUT_NAME}.lnk"
      CreateShortCut "$SMPROGRAMS\${SHORTCUT_NAME}.lnk" "$R0" "" "$INSTDIR\appIcon.ico" 0 "" "" "${APP_DESCRIPTION}"
      CreateShortCut "$SMPROGRAMS\Update SecPlus Sensei.lnk" "$INSTDIR\SecPlus Sensei Updater.exe" "" "$INSTDIR\appIcon.ico" 0 "" "" "Install the latest SecPlus Sensei update"
    !endif
  ${EndIf}
!macroend

!macro customWelcomePage
  !include "nsDialogs.nsh"

  Function SecPlusClickUpdate
    StrCpy $SecPlusContinueInstall "1"
    StrCpy $INSTDIR "$PROGRAMFILES64\${APP_FILENAME}"
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$INSTDIR"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$INSTDIR"
    GetDlgItem $0 $HWNDPARENT 1
    EnableWindow $0 1
    SendMessage $0 ${BM_CLICK} 0 0
  FunctionEnd

  Function SecPlusClickUninstall
    MessageBox MB_YESNO|MB_ICONQUESTION "Remove SecPlus Sensei from this computer?$\r$\n$\r$\nYour study progress in AppData is NOT deleted." IDYES do_uninst
    Return
    do_uninst:
    Call SecPlusRunUninstall
    Call SecPlusCloseInstaller
  FunctionEnd

  Function SecPlusClickExit
    Call SecPlusCloseInstaller
  FunctionEnd

  Function SecPlusMaintPage
    Call SecPlusFindExisting
    ${If} $SecPlusHasExisting == "0"
      Abort
    ${EndIf}

    Call SecPlusCheckOfferUpdate
    StrCpy $SecPlusContinueInstall ""

    GetDlgItem $0 $HWNDPARENT 1
    EnableWindow $0 0
    GetDlgItem $0 $HWNDPARENT 3
    EnableWindow $0 0

    nsDialogs::Create 1018
    Pop $0

    ${NSD_CreateLabel} 0u 0u 100% 68u "INSTALLER v${VERSION}$\r$\n$\r$\nInstalled: v$SecPlusPrevVersion at$\r$\n$SecPlusPrevLocation$\r$\n$\r$\nClick Update to install v${VERSION} (keeps your study progress). If you only see Uninstall, you opened an OLD setup file — use Documents\SecPlus Sensei Setup 1.0.6.exe"
    Pop $0

    ${NSD_CreateButton} 12u 72u 90u 16u "Update"
    Pop $R7
    ${NSD_OnClick} $R7 SecPlusClickUpdate
    ${NSD_CreateButton} 112u 72u 90u 16u "Uninstall"
    Pop $R7
    ${NSD_OnClick} $R7 SecPlusClickUninstall
    ${NSD_CreateButton} 212u 72u 90u 16u "Exit"
    Pop $R7
    ${NSD_OnClick} $R7 SecPlusClickExit

    nsDialogs::Show
  FunctionEnd

  Function SecPlusMaintLeave
    StrCmp $SecPlusContinueInstall "1" 0 +3
    StrCpy $SecPlusContinueInstall ""
    Return
    Abort
  FunctionEnd

  !insertmacro MUI_PAGE_WELCOME
  Page custom SecPlusMaintPage SecPlusMaintLeave
!macroend

!endif
