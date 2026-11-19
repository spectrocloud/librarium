.. headings # #, * *, =, -, ^, "

.. |prod-name-long| replace:: Spectro Cloud Palette eXtended Kubernetes
.. |prod-name-short| replace:: PXK

..
   DRAFT for review (DOC-3474). Placeholders to resolve before the upstream PR:
   * Product name, short name, title, and file name: waiting on the naming decision (DOC-3473).
   * Version column: Kevin Reeuwijk confirmed 4.10.17 on 2026-11-19, the same release number for
     Palette and VerteX. Only the product name waits on DOC-3473. PaletteAI 1.4.0 is in the
     PaletteAI release notes (September 30, 2026): https://docs.palette-ai.com/docs/release-notes/
   * Driver version: Kevin Reeuwijk confirmed 595.58.03-stig-fips on 2026-11-19.
   * Getting Support: confirm the support contact with Support (DOC-3473).
   * Matrix intro: the other partner pages say "<vendor> has self-validated". Here NVIDIA QA ran
     the validation on a Spectro Cloud cluster, so the intro says that. Confirm with Mike McKiernan.
   * NVIDIA's template also lists Helm (or the installation product) and Hardware Model.
     SUSE's page leaves both out. Decide with the reviewers whether to add them.
   Remove this comment before the upstream PR.

#############################################
|prod-name-long| with the NVIDIA GPU Operator
#############################################


******************************
Validated Configuration Matrix
******************************

NVIDIA QA validated |prod-name-short| with the NVIDIA GPU Operator and the NVIDIA STIG and FIPS driver container on a Spectro Cloud cluster, using the following components and versions:

.. list-table::
   :header-rows: 1

   * - Version
     - | NVIDIA
       | GPU Operator
     - | Operating
       | System
     - | Container
       | Runtime
     - Kubernetes
     - NVIDIA GPU
     - Date Validated

   * - | PaletteAI 1.4.0
       | <Palette or VerteX> 4.10.17
     - v26.7.2
     - | Ubuntu 24.04.4 LTS
       | with the Ubuntu Pro FIPS kernel
     - containerd 2.3.2
     - 1.35.6
     - NVIDIA RTX PRO 6000 Blackwell Server Edition
     - November 2026

The validated configuration uses version ``595.58.03-stig-fips`` of the NVIDIA ``gpu-driver-stig-fips`` driver container.
You must provide an NGC pull secret and an Ubuntu Pro token for the driver container.
Refer to :external+gpuop:ref:`gov-ready-prerequisites` in :external+gpuop:ref:`install-gpu-operator-gov-ready` for the prerequisites.


***************
Getting Support
***************

* Spectro Cloud product documentation: https://docs.spectrocloud.com

* Spectro Cloud product support: support@spectrocloud.com
