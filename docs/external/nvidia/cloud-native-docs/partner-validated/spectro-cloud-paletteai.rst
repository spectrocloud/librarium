.. headings # #, * *, =, -, ^, "

.. |prod-name-long| replace:: Spectro Cloud PaletteAI
.. |prod-name-short| replace:: PaletteAI

..
   DRAFT for review (DOC-3474). Resolve these items, then remove this comment before the upstream PR:
   * Product name: PaletteAI (Swarna Podila, 2026-11-19).
   * Version column: PaletteAI 1.4.0 is in the PaletteAI release notes (September 30, 2026):
     https://docs.palette-ai.com/docs/release-notes/. The cluster ran on Palette and VerteX release
     4.10.17 (Kevin Reeuwijk, 2026-11-19). The cell leaves 4.10.17 out because PaletteAI is the
     platform name. Add it back if the reviewers want the underlying release listed.
   * NVIDIA GPU Driver column: Kevin Reeuwijk confirmed 595.58.03-stig-fips on 2026-11-19. Rafay's
     page has the same column.
   * Helm and Hardware Model columns (template minimums): Kevin Reeuwijk, 2026-11-19. The
     NVIDIA GPU Operator pack deploys the Helm chart. Kevin did not name a Helm version, so the cell
     says "Helm v3" unless Kevin says otherwise (Linus Bourque, 2026-11-19). The hardware
     is as Kevin gave it: HPE DL380a Gen12, 2x Intel Xeon 6710E, 1 TB ECC RAM at 5200 MHz.
   * About and FIPS/STIG wording: Andreea Munteanu approved it on 2026-11-23. Rob Eckhardt
     deferred to others on 2026-11-20. The first two sentences follow
     https://docs.palette-ai.com/docs/what-is-paletteai/.
   * Prerequisites: the NVIDIA AI Enterprise subscription and NGC API key follow NVIDIA's
     gov-ready prerequisites (2026-11-23).
   * Matrix intro: the other partner pages say "<vendor> has self-validated". Here NVIDIA QA ran
     the validation on a Spectro Cloud cluster, so the intro says that. Confirm with Mike McKiernan.
   * Getting Support: docs.palette-ai.com and support@spectrocloud.com, the contact that
     docs.spectrocloud.com already publishes, unless Support asks for a change (DOC-3473,
     2026-11-23).
   * GitHub user name for end-user issues: still open (Jeremy Oakey). NVIDIA's partner rules
     require it in the upstream PR.
   * No Procedure section: the validation cluster was decommissioned on 2026-11-18, so no steps
     can be verified. Related Information is optional and is left out.
   * The gov-ready labels might move when NVIDIA moves the Government Ready content to the NVIDIA
     AI Enterprise documentation. If they move, the :external+gpuop:ref: links break.

#############################################
|prod-name-long| with the NVIDIA GPU Operator
#############################################


*********************************************
About the GPU Operator with |prod-name-short|
*********************************************

|prod-name-short| is a Kubernetes-native platform where platform teams manage the infrastructure for AI workloads, including GPU-accelerated clusters.
|prod-name-short| provisions Kubernetes clusters from cluster profiles, which define the operating system, Kubernetes, networking, and storage.
Spectro Cloud built the validation cluster from |prod-name-short| cluster profiles, not by hand.
A cluster profile layer installs the NVIDIA GPU Operator with the NVIDIA STIG and FIPS driver container.

For more information, refer to the `PaletteAI documentation <https://docs.palette-ai.com/docs/what-is-paletteai/>`__.


******************************
Validated Configuration Matrix
******************************

NVIDIA QA validated |prod-name-short| with the NVIDIA GPU Operator and the NVIDIA STIG and FIPS driver container on a Spectro Cloud cluster, using the following components and versions:

.. list-table::
   :header-rows: 1

   * - Version
     - | NVIDIA
       | GPU Operator
     - | NVIDIA
       | GPU Driver
     - | Operating
       | System
     - | Container
       | Runtime
     - Kubernetes
     - Helm
     - NVIDIA GPU
     - Hardware Model
     - Date Validated

   * - PaletteAI 1.4.0
     - v26.7.2
     - 595.58.03-stig-fips
     - | Ubuntu 24.04.4 LTS
       | with the Ubuntu Pro FIPS kernel
     - containerd 2.3.2
     - 1.35.6
     - | Helm v3, through the
       | NVIDIA GPU Operator pack
     - NVIDIA RTX PRO 6000 Blackwell Server Edition
     - | HPE DL380a Gen12
       | 2x Intel Xeon 6710E
       | 1 TB ECC RAM, 5200 MHz
     - November 2026


*************
Prerequisites
*************

The validated configuration uses the NVIDIA ``gpu-driver-stig-fips`` driver container, which has its own prerequisites:

* You must have an active NVIDIA AI Enterprise subscription and an NGC API key, provided to the cluster as a pull secret, so that the cluster can pull the driver container.

* You must provide an Ubuntu Pro token so that the driver container can download the kernel headers for the FIPS kernel.

Refer to :external+gpuop:ref:`gov-ready-prerequisites` in :external+gpuop:ref:`install-gpu-operator-gov-ready` for the complete list.


****************************************************
Verifying |prod-name-short| with the GPU Operator
****************************************************

Refer to :external+gpuop:ref:`running sample gpu applications` to verify the installation.


***************
Getting Support
***************

* |prod-name-short| product documentation: https://docs.palette-ai.com

* Spectro Cloud product support: support@spectrocloud.com
