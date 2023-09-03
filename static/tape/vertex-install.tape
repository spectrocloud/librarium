# Instructions:
# You need to replace the the variables below with your own credentials.
# Use envsubst to replace the variables in the file.
# Source a .env file with the variables or export them in your shell.
# You can use the following command to generate the file. 
# Assuming you have a .env file in the current directory.
# source .env && envsubst < vertex-install.tape > vertex-install-creds.tape
Require palette
Output static/assets/videos/vertex-install.mp4

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
Sleep 2s
Down 1
Sleep 1s
Enter
Type "y"
Sleep 1s
Enter
Sleep 2s
Type "${UBUNTU_PRO}" # Ubuntu Pro Token
Enter
Sleep 2s
Type "${FIPS_PALETTE_ARTIFACT_REPOSITORY_URL}" # Artifact Repository
Enter
Type@300ms "${FIPS_PALETTE_ARTIFACT_REPOSITORY_USERNAME}"
Enter
Type "${FIPS_PALETTE_ARTIFACT_REPOSITORY_PASSWORD}" # FIPS Packs Repository Password
Enter
Sleep 3s
Type "y" #Bypass X509 Verification
Enter
Sleep 3s
Enter # Select Infrastructure Provider
Sleep 2s
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
Sleep 3s
Down 1 # Select OCI ECR
Enter
Sleep 1s
Type "Palette Registry"
Enter
Sleep 2s
Type "${FIPS_OCI_ECR_URL}"
Enter
Sleep 2s
Type "${FIPS_OCI_ECR_BASE_PATH}"
Enter
Sleep 2s
Type "y"  # Allow Insecure Connection
Enter
Sleep 2s
Type "${FIPS_OCI_ECR_ACCESS_KEY}" # AWS Access Key
Enter
Sleep 2s
Type "${FIPS_OCI_ECR_SECRET_KEY}"
Enter
Sleep 2s
Type "${FIPS_OCI_ECR_REGION}"
Enter
Sleep 2s
Type "y" # Is Registry private?
Enter
Sleep 2s
Type@500ms "y" # Pull images from public registry?
Enter
Sleep 3s
Enter # Database Configurtion size
Sleep 2s
Type "vcenter.spectrocloud.dev"
Enter
Sleep 3s
Type "${VCENTER_USER}" # vCenter User
Enter
Sleep 3s
Type "${VCENTER_PASSWORD}" # vCenter Password
Enter
Sleep 3s
Type "y" # Allow Insecure
Enter
Sleep 4s
Enter  # Datacenter
Sleep 4s
Type "sp-karl" # vSphere folder
Sleep 3s
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
Sleep 3s
Type@500ms "n" # Fault Domain
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
Sleep 3s 
Type@300ms "10.1.1.0" # IP Start Range
Enter
Type@300ms "10.1.63.255" # IP End Range
Enter
Sleep 3s
Enter # Network CIDR
Type@300ms "10.10.128.1" # Gateway
Enter
Type@300ms "10.10.128.8" # DNS
Enter
Type@300ms "spectrocloud.dev"
Enter
Sleep 3s
Enter # Number of CPUs
Sleep 3s
Enter # Memory
Sleep 3s
Enter # Disk Size


Sleep 70s