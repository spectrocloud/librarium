Require palette
Output ../../content/docs/12.5-vertex/02-install-palette-vertex/vertex-install.mp4

Set FontSize 14
Set Width 950
Set Height 500
Set TypingSpeed 0.1
Set WindowBar Colorful
Set Margin 20
Set BorderRadius 10

Show
Type "palette ec install"
Enter
Sleep 1s
Down 1
Sleep 1s
Enter
Type@500ms "y"
Enter
Type "${UBUNTU_PRO}" # Ubuntu Pro Token
Enter
Type "https://repo-dev-fips.dev.spectrocloud.com"
Enter
Type@300ms "spectro"
Enter
Type "${FIPS_DEV_PACKS_REPOSITORY_PASSWORD}" # FIPS Packs Repository Password
Enter
Sleep 1s
Enter
Sleep 1s
Type "spectro-mgmt-cluster"
Enter
Sleep 2s
Enter  # HTTPS Proxy
Sleep 2s
Enter # HTTP Proxy
Sleep 2s
Enter # No Proxy
Sleep 2s
Enter # Proxy CA Cert
Sleep 2s
Type "172.16.0.0/20"
Enter
Sleep 1s
Type "10.155.0.0/24"
Enter
Sleep 1s
Type "y"
Enter
Sleep 1s
Type "vcenter.spectrocloud.dev"
Enter
Sleep 1s
Type "${VCENTER_USER}" # vCenter User
Enter
Sleep 1s
Type "${VCENTER_PASSWORD}" # vCenter Password
Enter
Sleep 1s
Type "y" # Allow Insecure
Enter
Sleep 4s
Enter
Sleep 4s
Type "sp-karl"
Sleep 1s
Enter
Sleep 3s
Down 1
Enter
Sleep 3s
Down 1
Enter
Sleep 3s
Enter
Sleep 3s
Enter  # VM Storage Policy
Sleep 3s
Enter # Datastore
Sleep 1s
Type "n" # Fault Domain
Sleep 2s
Enter # NPT servers
Enter
Sleep 2s # SSH Key
Escape
Type "dd"
Type "i"
Type "ssh-rsa AAAAB3NzaC1yc2EAA...."
Escape
Sleep 3s
Type@500ms ":wq"
Enter
Sleep 1s 
Type@300ms "10.1.1.0" # IP Start Range
Enter
Type@300ms "10.1.63.255" # IP End Range
Enter
Sleep 1s
Enter # Network CIDR
Type@300ms "10.10.128.1" # Gateway
Enter
Type@300ms "10.10.128.8" # DNS
Enter
Type@300ms "spectrocloud.dev"
Enter
Sleep 1s
Enter # Number of CPUs
Sleep 1s
Enter # Memory
Sleep 1s
Enter # Disk Size


Sleep 25s